import csv
import json
import requests
import sys

API_BASE = 'http://127.0.0.1:5000'
CSV_PATH = 'sample_data.csv'


def load_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = [dict(r) for r in reader]
    # convert numeric-like strings to numbers
    for r in rows:
        for k, v in list(r.items()):
            if v is None or v == '':
                continue
            try:
                if '.' in v:
                    n = float(v)
                else:
                    n = int(v)
                r[k] = n
            except Exception:
                pass
    return rows


def post_plot(endpoint, payload):
    url = API_BASE + endpoint
    try:
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if 'plot' in data:
            print(f"{endpoint}: OK, plot size={len(data['plot'])} chars")
        else:
            print(f"{endpoint}: No plot key in response: {data}")
    except Exception as e:
        print(f"{endpoint}: ERROR -> {e}")


if __name__ == '__main__':
    try:
        rows = load_csv(CSV_PATH)
    except Exception as e:
        print('Failed to load CSV:', e)
        sys.exit(1)

    # infer numeric and categorical
    if not rows:
        print('No rows found in CSV')
        sys.exit(1)

    sample = rows[0]
    numeric_cols = []
    categorical_cols = []
    for k, v in sample.items():
        if isinstance(v, (int, float)):
            numeric_cols.append(k)
        else:
            categorical_cols.append(k)

    payload = {'data': rows, 'dark': False}
    print('Testing light mode plots...')
    post_plot('/api/plots/heatmap', payload)

    if numeric_cols:
        payload_d = {'data': rows, 'column': numeric_cols[0], 'dark': False}
        post_plot('/api/plots/distribution', payload_d)

    if len(numeric_cols) >= 2:
        payload_s = {'data': rows, 'x': numeric_cols[0], 'y': numeric_cols[1], 'dark': False}
        post_plot('/api/plots/scatter', payload_s)

    if len(numeric_cols) >= 2:
        post_plot('/api/plots/pairplot', {'data': rows, 'dark': False})

    if numeric_cols and categorical_cols:
        post_plot('/api/plots/violin', {'data': rows, 'x': categorical_cols[0], 'y': numeric_cols[0], 'dark': False})

    print('\nTesting dark mode plots...')
    payload['dark'] = True
    post_plot('/api/plots/heatmap', payload)

    if numeric_cols:
        payload_d['dark'] = True
        post_plot('/api/plots/distribution', payload_d)

    if len(numeric_cols) >= 2:
        payload_s['dark'] = True
        post_plot('/api/plots/scatter', payload_s)

    if len(numeric_cols) >= 2:
        post_plot('/api/plots/pairplot', {'data': rows, 'dark': True})

    if numeric_cols and categorical_cols:
        post_plot('/api/plots/violin', {'data': rows, 'x': categorical_cols[0], 'y': numeric_cols[0], 'dark': True})

    print('\nSmoke test finished.')
