# URL-Shortener

# Functionalities added

> Shorten a URL

- Input: A regular URL

- Output: A shortened URL (use only ten digits, 26 lowercase characters, 26 uppercase characters) of extra length 2 from a given link.

- Handled the case that the 2-character length is running out of choices by retiring the shortened URL that has not been called for the longest time


> Retrieve a URL

- Input: A shortened URL 

- Output: Retrieve the original URL


> Basic admin

- Show all stored shortened URLs (including shortened URL, original URL, call count and latest call time) and sort by call count


> Clearall

- To delete all the records from the database.


# Technologies Used:

GCP, Docker, mongoDB, Postman(for testing api endpoints while coding), Node.js, pug(Used template engine to produce html),PM2(process manager), Terraform
