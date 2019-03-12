import { notStrictEqual } from "assert";

$(document).ready(function () {

    $(".save-btn").on("click", function (event) {
        let newSavedArticle = $(this).data();
        newSavedArticle.saved = true;
        console.log("saved was clicked");
        let id = $(this).attr("data-articleid");
        $.ajax("/saved/" + id, {
            type: "PUT",
            data: newSavedArticle
        }).then(
            function (data) {
                location.reload();
            }
        );
    }); // End of save

    $(".unsave-btn").on("click", function (event) {
        let newUnsavedArticle = $(this).data();
        let id = $(this).attr("data-articleid");
        newUnsavedArticle.saved = false;
        $.ajax("/saved/" + id, {
            type: "PUT",
            data: newUnsavedArticle
        }).then(
            function (data) {
                location.reload();
            }
        );
    }); // End of unsave

    // // Button to scrape new articles
    // $(".scrape-new").on("click", (event) => {
    //     event.preventDefault();
    //     $.get("/scrape", (data) => {
    //         window.location.reload();
    //     });
    // }); // End of scrape button

    $(".scrape-new").on("click", (req, res) => {
        $.ajax({
            type: "GET",
            url: "/scrape"
        }).then(function(data){
            location.reload();
        });
    });

    // Whenever someone clicks the add note button
    $(document).on("click", ".note-btn", function () {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the a tag
        var id = $(this).attr("data-articleid");

        // Now make an ajax call for the Article
        $.ajax({
                method: "GET",
                url: "/articles/" + id
            })
            // With that done, add the note information to the page
            .then(function (data) {
                console.log(data);
                // The title of the article
                $("#" + id + "notes").append("<h2>" + data.title + "</h2>");
                // An input to enter a new title
                $("#" + id + "notes").append("<input id='titleinput' name='title' >");
                $("#" + id + "notes").append("<p></p>");
                // A textarea to add a new note body
                $("#" + id + "notes").append("<textarea id='bodyinput' name='body'></textarea>");
                $("#" + id + "notes").append("<p></p>");
                // A button to submit a new note, with the id of the article saved to it
                $("#" + id + "notes").append("<p></p>");
                $("#" + id + "notes").append("<button data-articleid='" + data._id + "' id='savenote' class='btn btn-primary'>Save Note</button>");
                $("#" + id + "notes").append("<button data-articleid='" + data._id + "' id='closenote' class='btn btn-primary'>Close Note</button>");

                // If there's a note in the article
                if (data.note) {
                    // Place the title of the note in the title input
                    $("#titleinput").val(data.note.title);
                    // Place the body of the note in the body textarea
                    $("#bodyinput").val(data.note.body);
                }
            });
    });

    // When you click the savenote button
    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        let Id = $(this).attr("data-articleid");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + Id,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });

    $(document).on("click", "#closenote", function(){
        let id = $(this).attr("data-articleid");
        $("#" + id + "notes").empty();
    })

    $(document).on("click", ".shownote-btn", function(){
        let Id = $(this).attr("data-articleid")
        $.ajax({
            method: "GET",
            url: "/notes/" + Id,
            data: {
                title: note.title,
                body: note.body
            }
        }).then((data) => {

        })
    })
});