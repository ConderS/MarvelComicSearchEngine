Conder Shou
cs3544

# How to run the app

- Open “index.html” in Google Chrome (provided you have internet access)

- This does not work on Safari because Ajax requests don't seem to work that well in Safari (this seems to be a common issue based on my research online). I've spent a lot of time trying to get it to work on Safari to no avail. Because I do not have a PC, I was also not able to test this out on IE, but I am optimistic that it might work there as well.

# Dependencies

All plugins are inputted in `index.html`

Plugins include:
- jQuery
- Material.io (two different versions, one containing a custom implementation of Material dropdown)
- md5.js (for hashing)
- Material Icons
- Anything else came with the HTML5 Boilerplate 

# Design Decisions

## General 

I have ensured a responsive design for the entire web application, where everything maintains neat and clear order up until 390px in screen width. Note that the standard size of mobile screen is 480px so this is more than enough room for users to use this web application in windows of different sizes as well as on their phones. This helps meet the heuristic for a flexible and efficient design. Examples of things I did to allow this to happen is that the application moves the search button over to the right at 880px to avoid getting too cluttered with the advanced criteria option and the documentation for `orderBy` becomes slightly smaller with reduced line height at 715px screen width to allow for both clear visibility and to avoid crowding on top of the form fields.

Note that the user at any time can click the title of the website to reset all search fields and results and queries (even when in the middle of a query). This should be noticeable to the user because the title is bolded, and when the user hovers their mouse over the title, it then becomes underlined to show that it contains a link (likely to the home page, which in this case is a new version of the same page). This is consistent with the standards of other web applications (like Google search) and also provides user control and freedom by giving them an emergency exit at all times.

## Form 

The default search is `titleStartsWith` since in most cases, I don't expect the user to know the exact name of the comic they're looking for. In these cases, I believe the user would rather have false positives than false negatives. Since users also most often associate titles and keywords of titles with the comics they like, I have set this as the main input outside of `Advanced Search Criteria` to better meet the heuristic of matching the system with the real world and that of flexibility and efficiency of use.

I have also made it easy to toggle between the `titleStartsWith` search to instead match with the exact title given by the user since both utilize the same input dialog, and since it is more possible for someone to want to instantly search an exact title than it is for them to use the other advanced search criteria. I believe including one extra form of input is not overwhelming to the user and is convenient for them to have quick access to. This meets both the heuristic for Error Prevention (since I am preventing them from executing a non-sensical query of querying for comics with both the `titleStartsWith` and the `title` parameters at once), and that of flexibility and efficiency of use. With the noticeable and simple toggle to swtich between the two, I have also pursued the heuristic of an aesthetic and minimalist design.

I have grouped the search parameters for `startYear`, `format` and `orderBy` as advanced criteria that can be toggled by a more tech-savy or experienced user. I did this to avoid overwhelming the user with different forms of input and for them to also realize that these fields are all optional. This helps me maintain flexibility and efficiency of use for different users, maintains an aesthetic and minimalist design (only showing the fields when necessary), and prevents novices from receiving sub-optimal search results when trying to specify fields they may not be familiar with (error prevention).

Because the `ascending/descending` option of `orderBy` only works when a specific option of orderBy is selected besides that of the default, I have included clear, visible notes located underneath the orderBy fields to clarify this. This provides help and documentation for the user for something they may not have realized immediately (it would be tempting to think that changing the `ascending/descending` options would still affect the results even when `orderBy` is not specified).

When it comes to selecting the `format` and `orderBy`, I have also made this a dropdown to ensure that the user would know what options they can select from and without manually typing any of it (thus risking misspellings). This connects with the heuristic for error prevention.

Note that for all of these fields, they have descriptive labels to guide the user and their default is to not be included in the query if they are unspecified. This makes the most sense since it gives the widest selection of comics that match the specific constraints set by the user. This is consistent and meets the standards of other search engines in the internet, provides documentation and help for the user, and also allows for efficient design with regards to execution of the search queries.

## Searching

When the user executes a search, if they have the advanced criteria open, the criteria will automatically collapse to allow user greater visibility of the results. This adds to efficiency of use.

Upon execution of a search, the search button is then disabled to prevent user from making multiple requests while the results are being queried. This can cause errors in the results returned if the user changes the fields while the previous results are still being loaded. This helps address the heuristic for preventing user errors and maintaining an effcient design.

Also, when the search query is being called to the API, I've included a loading spinner to let the user know that the system is working. I would have put a progress if possible but the API does not support sending back progress information. As a result, I left a spinner to at least allow the user to realize what the state of the system is. This addresses the heuristic of the visibility of the system status.

I also query for optimal image quality and count. For thumbnail images, I have chosen to query for the lowest quality that is still clear for the user to comfortably look at (landscape_large) to save search time. Meanwhile, I only query for 30 images at a time because a user will often only paginate a few pages before beginning a new search. If they should choose to continue paginating, I make furthe calls to the server (this is addressed in the next setion). Therefore, I saw no need to query 100 images at a time. All of this adds to the efficiency of the interface.

## Results Section

I've included pagination buttons at the bottom and top of the page to allow the user to be able to paginate back and forth without having to scroll all the way back up/down the page as they view the results. This gives flexibility and efficiency of the user experienece.

For the comic character results themselves, I've set a neutral blue background that generally looks well no matter the thumbnail image of the character. The text is separated distinctly from the image so that the text is always clearly visible on the white background of the bottom of the card. I chose the specific width of the cards and images/text so that the view of the results wasn't too cluttered or sparse (inefficeient) for the user. The grid design in this results section is also extremely responsive, working way beyond the 480px mobile screen width. For all these reasons mentioned, I was aligning with the heuristics of aesthetic, minimalist, flexible, and efficient design. 

I have also included the comic book information for each character card to avoid the user having to check if the results agreed with their search criteria. This addresses the heuristic of minimizing the user's memory, and allowing more on recognition rather than recall.

I have also helped users recognize, diagnose, and recover from the main errors they will come across using this application. There are four of them - internal server error, reaching the API quota, reaching the end of their pagination, and sending a query that has no results. I identify when there are server errors, which are usually intermittent and are fixed when I refresh the page, or are due to an invalid query in `startYear` (still more efficient to type the year in my opinion than to select the dropdown), and advise the user to do the same. Further, I check when the server error code is that of reaching the request quota for the API key. In this case, I tell the user of this error and for them to wait a day before sending more requests (nothing else I can do). In addition, when the user paginates to the point where no more comics are left for the API to send back, I identify this for them and tell the user to paginate back or start a new search. Lastly, when the user simply sends a search that doesn't have any comics associated with it, I tell the user to try a new search. All of these are ways of helping the user recognize, diagnose, and recover from the errors.

Also, when the user is paginating, since I only query for 30 results at a time, the interface will make a request to the API after paginating every 3 pages and appropriately offset the results loaded so that the user views the results for the page they had paginated to. Durin this time, I show the loading spinner again and disable the paginatino and submit buttons. This makes it clear to the user that more images are being queried (visible system status) and prevents them from making further calls to the already busy server (error prevention and efficiency).
    The buttons are of course reenabled when the query is complete.

I have tried my best to put all my design decisions down in this README. It is possible I made many more decisions during the process of building this interface, but these are at the very least, the major ones.
