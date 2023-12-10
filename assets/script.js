$(document).ready(function() {
    $("#replaceContentButton").click(function() {
      $("#sectionToReplace").html
      ("<h2>New Content</h2>;<p>This is the new content of the 'about' section.</p>");
    });
  });