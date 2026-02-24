from bs4 import BeautifulSoup
import os


# Step 1: Get the links from listing page
with open("listing.html", "r") as f:
    main_soup = BeautifulSoup(f.read(), "html.parser")

links = main_soup.select('.product-link')

# Step 2: Loop through the links
for link in links:
    relative_path = link.get('href')   #this gets laptop1.html
    # In a real site, we'd use urljoin here. Since it's local, we just open it.
    with open(relative_path, "r") as f:
        product_soup = BeautifulSoup(f.read(), 'html.parser')
        #Step 3: Extract the "hidden" data
        name = product_soup.select_one('#item-name').text
        price = int(product_soup.select_one(".amount").text)

        print(f"Scraped: {name} | Price: {price} AED")





        
