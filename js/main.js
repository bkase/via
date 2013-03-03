Modernizr.addTest('standalone', function(){
    return window.navigator.standalone;
});

if(navigator.standalone != undefined && !!!navigator.standalone){
    // TODO: show notification telling users to install app as standalone
    return;
}

/* Global object for storing data, used to simluate a server for the time being
 * This is, after all, only a prototype :)
 */
var Via = {
    lists: [
        { name: "Work Friends",
          length: 6,
          people: "Brandon, Tomer, Arthur, Evan, Chris, Liz" 
        },
        { name: "College Friends",
          length: 3,
          people: "Mike, Peter, Nick" 
        },
        { name: "Interaction Design Friends",
          length: 3,
          people: "Elina, Soyeon, Lisa"}
    ],
}

$(document).ready(function(){
    /* bind tab change links */
    $("#tab_bar a").click(function(e){
        e.preventDefault();

        /* reset visit history on new tab */
        visits.clear();

        var nextPage = $(e.target.hash);
        transition(nextPage, "fade");

        /* not yet sure if ill need this for styling reasons */
        $("#tab_bar").attr("class", e.target.hash.slice(1));

        /* remove selected class from all tabs... */
        $("#tab_bar li").each(function(){
            $(this).removeClass("tab_selected");
        })

        /* ..and add it back to the one that was just clicked */
        $(e.target).parent().addClass("tab_selected");
    });

    /* bind all other page links */
    $("#pages").on("click", "a.page_link", function(e){
        e.preventDefault();
        var nextPage = $(e.target.hash);
        transition(nextPage, "push");
    });

    /* bind back button click event */
    $("#pages").on("click", ".back", function(e){
        /* find the last page in history, and transition to it, if possible */
        e.preventDefault();
        var lastPage = visits.back();
        if(lastPage) {
            transition(lastPage, "push", true);
        }
    })

    transition($("#routes_page"), "show");

    var source   = $("#lists_template").html();
    var template = Handlebars.compile(source);
    var context  = Via.lists;
    var html     = template(context);

    $("#lists_page").append(html);
})

function transition(toPage, type, reverse) {
    var toPage = $(toPage)
    var fromPage = $("#pages .current");
    reverse = reverse ? "reverse" : "";

    visits.add(toPage);

    if(visits.hasBack()){
        toPage.find(".back").addClass("hasBack");
    }

    if(toPage.hasClass("current") || toPage === fromPage){
        return;
    }

    toPage
        .addClass("current " + type + " in " + reverse)
        .one("webkitAnimationEnd", function(){
            fromPage.removeClass("current " + type + " out " + reverse);
            toPage.removeClass(type + " in " + reverse);
        });
        fromPage.addClass(type + " out " + reverse);

    // for non webkit browsers
    if(!("WebKitTransitionEvent" in window)){
        toPage.addClass("current");
        fromPage.removeClass("current");
        return;
    }
}


var visits = {
    history: [],
    add: function(page) {
        this.history.push(page);
    },
    hasBack: function() {
        return this.history.length > 1;
    },
    back: function() {
        if(!this.hasBack()){
            return;
        }
        var curPage = this.history.pop();
        return this.history.pop();
    },
    clear: function() {
        this.history = [];
    }
}