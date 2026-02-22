import requests
from bs4 import BeautifulSoup
import csv
import time
import random

# headers = {             #we create dictionary for our headers
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
# }
# response = requests.get("https://www.google.com", headers = headers)
# soup = BeautifulSoup(response.text, "html.parser")
    
    # Basics of soup & requestd
# links = soup.find_all("a")
# print(response.status_code)
# print(soup.title.text)
# print(f"I found {len(links)} links on this page")


    # We try to find a tag that might not exist
# headings = soup.find("h1")
# if headings:
#     print(f"heading found: {headings.text}")
# else:
#     print("No heading found on this page. Skipping")


    # Step 2: Attribute Hunting.
# first_link = soup.find("a")
# if first_link:
#     url = first_link["href"]
#     print(f"The first link points to: {url}")


    # Step 3: CSS Selectors.
# main_container = soup.select_one("main")
# if main_container:
#     print('Found the Main container')
#     print(main_container.text[:50])
# else:
#     print("Could not find an element with ID 'main'.")


    # The Loop Logic
# links = soup.find_all("a")
# for link in links:
#     address = link.get("href")            # We grab the 'href' attribute for every single link in the list
#     print(f"Link found: {address}")


    # common pattern for "cleaning" your data during a loop:
# all_links = soup.find_all("a")
# for link in all_links:
#     address = link.get('href')
#     text = link.text.strip()        #.strip() removes extra spaces and new lines
#     if address and text:
#         print(f"Found: {text} -> {address}")


    # Scraping on practise page (practise.html)
with open("practise.html", "r") as f:
    page_content = f.read()
soup = BeautifulSoup(page_content, "html.parser")
all_product_names = []
products = soup.select(".name")


# for item in products:
#     name = item.text.strip()
#     all_product_names.append(name)
#     print(f"{name} added to list")
# print(f"There are {len(all_product_names)} in the html page")

# print(products[1].text)         #checking what products item returns

prices = soup.select(".price")      #trying to make dictionary of names & prices.
Price_list = {}                      
for item, price in zip(products, prices):           
    name = item.text.strip()
    price = price.text.strip()
    Price_list[name] = price


    # Saving the Dictionary to CSV
with open('competitor_prices.csv', 'w', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Product Name", "Price"])  #Headers
    for name, price in Price_list.items():
        writer.writerow([name, price])  #process the data
        wait_time = random.uniform(1, 4)
        print(f'Waiting {wait_time: .2f} seconds before next request')
        time.sleep(wait_time)
