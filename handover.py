from bs4 import BeautifulSoup
import csv

with open("practise.html",'r') as f:
    content = f.read()

soup = BeautifulSoup(content, "html.parser")

premium_products = []

for name, price in zip(soup.select(".name"), soup.select(".price")):
    price = int(price.text.replace("AED", ""))
    name = name.text.strip()
    if price > 4000:
        premium_products.append({"Product Name": name, "Price": price})

# print(premium_products)

fieldnames = ['Product Name', 'Price']

with open("premium_products.csv", 'w', newline = '') as file:
    writer = csv.DictWriter(file, fieldnames)
    writer.writeheader()
    for item in premium_products:
        writer.writerow(item)


