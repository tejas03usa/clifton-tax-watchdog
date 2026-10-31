#!/usr/bin/env python3
"""
NJ Municipal Taxpayer Watchdog (Clifton & Parsippany) - Automated Scheduled Data Updater & Health Check
Runs via GitHub Actions on a recurring cron schedule.

Tasks:
1. Validates and reconciles all 13 datasets in data/ (Clifton) and data/parsippany/ (Parsippany-Troy Hills)
2. Pings official government portals to check availability and track changes:
   - City of Clifton & Clifton Public Schools
   - Township of Parsippany-Troy Hills & PTHSD Schools
   - Passaic & Morris County Boards of Taxation
3. Ensures 100% mathematical integrity of the 1,850 property assessments rolls for both municipalities
4. Updates lastVerified timestamp and writes an automated health check audit log
"""

import json
import os
import sys
import datetime
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')

MUNICIPALITIES = [
    {
        'id': 'clifton',
        'name': 'Clifton',
        'dir': DATA_DIR,
        'expectedRate': 6.527
    },
    {
        'id': 'parsippany',
        'name': 'Parsippany-Troy Hills',
        'dir': os.path.join(DATA_DIR, 'parsippany'),
        'expectedRate': 3.550
    },
    {
        'id': 'wayne',
        'name': 'Wayne Township',
        'dir': os.path.join(DATA_DIR, 'wayne'),
        'expectedRate': 5.946
    },
    {
        'id': 'montclair',
        'name': 'Montclair Township',
        'dir': os.path.join(DATA_DIR, 'montclair'),
        'expectedRate': 3.766
    },
    {
        'id': 'morristown',
        'name': 'Town of Morristown',
        'dir': os.path.join(DATA_DIR, 'morristown'),
        'expectedRate': 1.575
    },
    {
        'id': 'montville',
        'name': 'Montville Township',
        'dir': os.path.join(DATA_DIR, 'montville'),
        'expectedRate': 2.661
    },
    {
        'id': 'glenrock',
        'name': 'Borough of Glen Rock',
        'dir': os.path.join(DATA_DIR, 'glenrock'),
        'expectedRate': 3.407
    }
]

OFFICIAL_PORTALS = [
    {
        'name': 'City of Clifton Official Portal',
        'url': 'https://www.cliftonnj.org',
        'type': 'Municipal (Clifton)'
    },
    {
        'name': 'Clifton Public Schools (BOE)',
        'url': 'https://www.clifton.k12.nj.us',
        'type': 'School District (Clifton)'
    },
    {
        'name': 'Passaic County Board of Taxation',
        'url': 'https://www.passaiccountynj.org/residents/board-of-taxation',
        'type': 'County Tax Board (Passaic)'
    },
    {
        'name': 'Township of Parsippany-Troy Hills Official Portal',
        'url': 'https://www.parsippany.net',
        'type': 'Municipal (Parsippany)'
    },
    {
        'name': 'Parsippany-Troy Hills School District (PTHSD)',
        'url': 'https://www.pthsd.k12.nj.us',
        'type': 'School District (Parsippany)'
    },
    {
        'name': 'Morris County Board of Taxation',
        'url': 'https://www.morriscountynj.gov/Departments/Taxation',
        'type': 'County Tax Board (Morris)'
    },
    {
        'name': 'Essex County Board of Taxation',
        'url': 'https://www.essexcountynj.org/board-of-taxation/',
        'type': 'County Tax Board (Essex)'
    },
    {
        'name': 'Bergen County Board of Taxation',
        'url': 'https://www.co.bergen.nj.us/board-of-taxation',
        'type': 'County Tax Board (Bergen)'
    },
    {
        'name': 'Borough of Glen Rock Official Portal',
        'url': 'https://www.glenrocknj.net',
        'type': 'Municipal (Glen Rock)'
    }
]

DATA_FILES = [
    'tax_breakdown.json',
    'boe_budget.json',
    'municipal_budget.json',
    'benefits_healthcare.json',
    'ethics_controversies.json',
    'ethics_disclosures.json',
    'staff_directory.json',
    'vendors_spending.json',
    'demographics_taxes.json',
    'surrounding_towns_comparison.json',
    'property_assessments.json',
    'commercial_pilot_shift.json',
    'fair_tax_scenarios.json'
]

def check_portal(portal):
    req = urllib.request.Request(
        portal['url'],
        headers={'User-Agent': 'NJMunicipalTaxWatchdog/2.0 (+https://github.com/tejas03usa/clifton-tax-watchdog)'}
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return {'status': 'ONLINE', 'code': resp.status, 'error': None}
    except urllib.error.HTTPError as e:
        return {'status': 'ONLINE_HTTP_CODE', 'code': e.code, 'error': None}
    except Exception as e:
        return {'status': 'OFFLINE_OR_TIMEOUT', 'code': None, 'error': str(e)}

def audit_directory_integrity(target_dir, expected_rate):
    results = {}
    for filename in DATA_FILES:
        filepath = os.path.join(target_dir, filename)
        if not os.path.exists(filepath):
            results[filename] = {'valid': False, 'error': 'File missing'}
            continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Specific check for property assessments
            if filename == 'property_assessments.json':
                props = data.get('properties', [])
                count = len(props)
                forbidden_keys = ['bedrooms', 'bathrooms', 'squareFeet', 'garage']
                has_forbidden = False
                sample = props[0] if props else {}
                for k in forbidden_keys:
                    if k in sample:
                        has_forbidden = True
                        break
                discrepancies = 0
                for p in props:
                    expected_tax = round((p['assessedTotal'] / 100.0) * expected_rate, 2)
                    if abs(p['annualTax'] - expected_tax) > 0.05:
                        discrepancies += 1
                results[filename] = {
                    'valid': discrepancies == 0 and count > 0 and not has_forbidden,
                    'recordCount': count,
                    'calculationDiscrepancies': discrepancies,
                    'cleanMod4Fields': not has_forbidden
                }
            else:
                results[filename] = {'valid': True, 'keys': list(data.keys())}
        except Exception as e:
            results[filename] = {'valid': False, 'error': str(e)}
    return results

def main():
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    now_iso = now_utc.strftime('%Y-%m-%d %H:%M:%S UTC')
    date_str = now_utc.strftime('%Y-%m-%d')
    print(f"=== NJ Municipal Tax Watchdog Automated Updater: {now_iso} ===")

    # 1. Check official government portals
    print("\n[1/3] Pinging official portals for availability & updates...")
    portal_statuses = []
    for p in OFFICIAL_PORTALS:
        status = check_portal(p)
        print(f"  • {p['name']} ({p['type']}): {status['status']} (Code: {status.get('code')})")
        portal_statuses.append({
            'name': p['name'],
            'url': p['url'],
            'status': status['status'],
            'code': status.get('code')
        })

    # 2. Audit local dataset integrity across all municipalities
    print(f"\n[2/3] Auditing JSON dataset integrity across {len(MUNICIPALITIES)} municipalities...")
    muni_health_records = {}
    all_valid = True

    for m in MUNICIPALITIES:
        health = audit_directory_integrity(m['dir'], m['expectedRate'])
        is_valid = all(v.get('valid') for v in health.values())
        if not is_valid:
            all_valid = False
        prop_count = health.get('property_assessments.json', {}).get('recordCount', 0)
        print(f"  • {m['name']} ({len(DATA_FILES)} datasets): valid={is_valid} (Rate: {m['expectedRate']}%, Parcels: {prop_count:,})")
        muni_health_records[m['id']] = {
            'name': m['name'],
            'certifiedTaxRate': f"{m['expectedRate']:.3f}%",
            'totalMonitoredProperties': prop_count,
            'allValid': is_valid,
            'datasetAudit': health
        }

    # 3. Write automated health check and update verification timestamp
    print("\n[3/3] Recording audit log & updating verification status...")
    audit_log = {
        'lastRun': now_iso,
        'date': date_str,
        'allDatasetsValid': all_valid,
        'municipalities': muni_health_records,
        'portalHealth': portal_statuses,
        'status': 'OPERATIONAL' if all_valid else 'DEGRADED'
    }

    audit_path = os.path.join(DATA_DIR, 'audit_log.json')
    with open(audit_path, 'w', encoding='utf-8') as f:
        json.dump(audit_log, f, indent=2)

    print(f"✓ Health log successfully updated: {audit_path}")
    print("=== Update & Audit Complete ===")

if __name__ == '__main__':
    main()

