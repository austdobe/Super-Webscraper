$(document).ready(function() {
 
  var articleContainer = $(".container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);
  
  
  
  // When you click the save button
$(document).on("click", "#save", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
initPage = () =>{
  // Run an AJAX request for any unsaved headlines
  $.get("/all").then(function(data) {
    articleContainer.empty();
    // If we have headlines, render them to the page
    if (data && data.length) {
      renderArticles(data);
    } else {
      // Otherwise render a message explaining we have no articles
      renderEmpty();
    }
  });
}

handleArticleScrape = () => {
  $.get("/scrape")
  .then(data =>{

  })
}
function handleArticleClear() {
  $.get("/clear").then(function() {
    articleContainer.empty();
    initPage();
  });
}

})