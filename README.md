Conder Shou
cs3544

—How to run app

Click on “index.html”
Internet is connected
Fill in fields and read field and button labels to make appropriate searches
Use arrows to iterate through pages

— Dependencies
Everything should be included in the index.html
- jQuery
- Material.io (two different versions to add in material dropdown)
- md5.js
- material icons

Everything else came with the HTML5 Boilerplate 

— Form (ADD HEURISTIC REFERENCES)

- Default is TitleStartsWith since most cases, user doesn’t know exact name of comic, and in these cases the user would rather have false positives than false negatives 
- easy toggle with Title to match title so that user can change to this mode if they want to search for comics for exact title (a more advanced option but likely the most common of the advanced options since we intuitively think of titles of works rather than the year/format)
- it’s a toggle because if it was another field: doesn’t make sense to want to match with a title name AND to want a separate set of comics that have a similar starting name

- startYear and format are not commonly used, to avoid overwhelming user with options, we have them as advanced options

- responsive design - everything still fits and is neatly visible up until 390px in screen width, the standard size of mobile screen is 480 px
- search button moves over to the right at 880px to avoid getting too cluttered with the advanced criteria option
- text for toggle becomes slightly smaller but not too small with reduced line height at 715px screen width to allow for clear visibility but to also avoid crowding on top of the form fields

- Page iteration buttons are at the top because the user will be able to see most of results without scrolling downwards - this allows for faster page iteration

- Character cards
- Neutral blue background
- Text was normally on top of the picture, but different background images could make text hard to see, so made it underneath
- chose fixed size that was comfortable and allowed for most number of results to fit in one page at time to minimize scrolling
- clarity of text description
- responsive grid design that works way beyond mobile size of 480px

- Error
- Server Error
- Identified and gave user solution to get past it that works for me
- No characters found
- Identified and gave to user with an approach to try a search for different comics

- Loading
- Was going to do progress but API doesn’t provide progress of the query, so went with generic loading indicator
- Prevent user from clicking searching button more than once by disabling





