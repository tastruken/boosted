import json
import re

def parse_lighthouse():
    with open('lighthouse-report-v2.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    m = re.search(r'window\.__LIGHTHOUSE_JSON__ = (.*?);</script>', html, re.DOTALL)
    if not m:
        print("No json found")
        return
        
    data = json.loads(m.group(1))
    audits = data['audits']
    
    print("FAILED AUDITS (< 100% score):\n")
    for key, a in audits.items():
        score = a.get('score')
        mode = a.get('scoreDisplayMode')
        if score is not None and score < 1 and mode not in ('notApplicable', 'manual', 'informative'):
            title = a.get('title')
            displayValue = a.get('displayValue', '')
            print(f"- {title} (Score: {score})")
            if displayValue:
                print(f"  {displayValue}")

if __name__ == '__main__':
    parse_lighthouse()
