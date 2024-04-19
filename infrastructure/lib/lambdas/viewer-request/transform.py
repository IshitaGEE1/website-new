import json
import csv
import sys

if len(sys.argv) < 3:
    print("ERROR: no input file given")
    exit(1)

fileToTransform = sys.argv[1]
if not fileToTransform.endswith(".csv"):
    print("ERROR: input file must end with *.csv")
    exit(1)

targetFile = sys.argv[2]
if not targetFile.endswith(".json"):
    print("ERROR: target file must end with *.json")
    exit(1)

with open(fileToTransform, "r") as f:
    result = []

    for line in csv.reader(f):
        key = line[0].replace("https://www.productsup.com", "")
        value = line[1]

        if not key.startswith("/") or value == '':
            continue

        result.append({"from": key, "to": value})

    with open(targetFile, "w") as t:
        json.dump(result, t, indent=2)

    print(json.dumps(result, indent=2))
