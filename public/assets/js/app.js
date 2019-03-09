$(document).ready(function(){
    // Button to scrape new articles
    $("#scrape-new").on("click", (event) => {
        event.preventDefault();
        $.get("/scrape", (data) => {
            window.location.reload();
        });
    }); // End of scrape button

    $("").on("click", (event) => {

    })
})