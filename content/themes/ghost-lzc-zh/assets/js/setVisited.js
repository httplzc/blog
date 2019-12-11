$(
    function () {
        $.post("/extra_api",
            {
                a:"set_visited",
                page_location: location.href,
                page_title: $("title").text(),
				agent:navigator.userAgent.toLowerCase()
            })
    }
);