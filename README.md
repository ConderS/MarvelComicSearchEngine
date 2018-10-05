Conder Shou
cs3544

# How to run the app

- Open “index.html” in Google Chrome (provided you have internet access)

- This does not work on Safari because Ajax requests don't seem to work that well in Safari (this seems to be a common issue based on my research online). I've spent a lot of time trying to get it to work on Safari to no avail. Because I have a Mac and not a PC, I was also not able to test this out on IE.

# Dependencies

All plugins are inputted in `index.html`

Plugins include:
- jQuery
- Material.io (two different versions, one containing a custom implementation of Material dropdown)
- md5.js (for hashing)
- Material Icons
- Anything else came with the HTML5 Boilerplate 

# Design Decisions

## Form   



The default search is `titleStartsWith` since in most cases, I don't expect the user to know the exact name of the comic they're looking for. In these cases, I believe the user would rather have false positives than false negatives. Since users also most often associate titles and keywords of titles with the comics they like, I have set this as the main input outside of `Advanced Search Criteria` to better meet the heuristic of matching the system with the real world and that of flexibility and efficiency of use.

I have also made it easy to toggle between the `titleStartsWith` search to instead match with the exact title given by the user since both utilize the same input dialog, and since it is more possible for someone to want to instantly search an exact title than it is for them to use the other advanced search criteria. I believe including one extra form of input is not overwhelming to the user and is convenient for them to have quick access to. This meets both the heuristic for Error Prevention (since I am preventing them from executing a non-sensical query of querying for comics with both the `titleStartsWith` and the `title` parameters at once), and that of flexibility and efficiency of use. With the noticeable and simple toggle to swtich between the two, I have also pursued the heuristic of an aesthetic and minimalist design.

I have grouped the search parameters for `startYear`, `format` and `orderBy` as advanced criteria that can be toggled by a more tech-savy or experienced user. I did this to avoid overwhelming the user with different forms of input and for them to also realize that these fields are all optional. This helps me maintain flexibility and efficiency of use for different users, maintains an aesthetic and minimalist design (only showing the fields when necessary), and prevents novices from receiving sub-optimal search results when trying to specify fields they may not be familiar with (error prevention).

Because the `ascending/descending` option of `orderBy` only works when a specific option of orderBy is selected besides that of the default, I have included clear, visible notes located underneath the orderBy fields to clarify this. This provides help and documentation for the user for something they may not have realized immediately (it would be tempting to think that changing the `ascending/descending` options would still affect the results even when `orderBy` is not specified).

When it comes to selectin the `format` and `orderBy`, I have also made this a dropdown to ensure that the user would know what options they can select from and without manually typing any of it (thus risking misspellings). This connects with the heuristic for error prevention.

I have also ensured a responsive design for the entire web application, where everything maintains neat and clear order up until 390px in screen width. Note that the standard size of mobile screen is 480px so this is more than enough room for users to use this web application in windows of different sizes as well as on their phones. This helps meet the heuristic for a flexible and efficient design.

- search button moves over to the right at 880px to avoid getting too cluttered with the advanced criteria option
- text for toggle becomes slightly smaller but not too small with reduced line height at 715px screen width to allow for clear visibility but to also avoid crowding on top of the form fields

- Page iteration buttons are at the top because the user will be able to see most of results without scrolling downwards - this allows for faster page iteration

Character cards
- Neutral blue background
- Text was normally on top of the picture, but different background images could make text hard to see, so made it underneath
- chose fixed size that was comfortable and allowed for most number of results to fit in one page at time to minimize scrolling
- clarity of text description
- responsive grid design that works way beyond mobile size of 480px

Error
- Server Error
    - Identified internal server error (fail to respond) and gave user solution to get past it that works for me
    - Also identify when server error is due to too man requests (error code 429), and sends custom message to user, telling him/her to wait one day to search again
- No characters found
    - Identified and gave to user with an approach to try a search for different comics
- Prevent user from clicking searching button more than once by disabling it when search begins

Loading
- Was going to do progress but API doesn’t provide progress of the query, so went with generic loading indicator
- When loading more images, all buttons are disabled and then later renabled for user to decide what to do next (go back to previous page or start new search)






