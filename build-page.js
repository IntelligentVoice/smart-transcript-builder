function buildPage(tags, url) {
	return `
	<!DOCTYPE html>
	<html slick-uniqueid="3"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	    <link rel="stylesheet" type="text/css" href="https://comprindeo.intelligentvoice.com/smarttranscript.css">
	    <script>
	        function scrollToView() {
	            var a = document.getElementById("doc-scroller");
	            var d = a.getElementsByClassName('highlight');
	            if (d.length) {
	                d = d[0];
	                var scrollHeight = a.offsetHeight;
	                var scrollOffset = a.scrollTop;
	                var targetOffset = d.offsetTop;
	                // Scroll into viewport only if out of bounds.
	                if ((targetOffset > (scrollHeight + scrollOffset)) || (targetOffset < scrollOffset)) {
	                    a.scrollTop = targetOffset - 20;
	                }
	            }
	        }
	        function getClosestValues(a, x) {
	            var lo = -1, hi = a.length;
	            while (hi - lo > 1) {
	                var mid = Math.round((lo + hi) / 2);
	                if (a[mid] <= x) {
	                    lo = mid;
	                } else {
	                    hi = mid;
	                }
	            }
	            if (a[lo] === x)
	                hi = lo;
	            return [a[lo], a[hi]];
	        }
	        function seek2(pos, offset) {
	            if (!isNaN(offset)) {
	                pos += offset;
	                if (pos < 0) {
	                    pos = 0;
	                }
	            }
	            var mediaElement = document.getElementById('media_player');
	            mediaElement.currentTime = pos / 1000;
	            scrollToView();
	        }
	    </script>
	</head>
	<body>
	<div class="ui-widget ui-widget-content" id="document-div">
	    <table>
	        <tbody><tr>
	            <td>
	                <div id="topics">
	                    <h2><em>JumpTo</em> Topics</h2><br>
	                    <div id="topics-container">
	                    	${tags}
	                    </div>
	                </div>
	            </td>
	            <td id="table_1">
	                <div id="doc-main">
	                   
	                    <video id="media_player" controls=""><source src="${url}"></video>
	                    <!-- <div id="position"></div> -->
	                    <div style="position:relative;" id="doc-scroller"></div>
	                </div>
	            </td>
	        </tr>
	    </tbody></table>
	</div>
	<script>
	    var media_player = document.getElementById('media_player'),
	        current_links = [],
	        linkers = [];
	    document.addEventListener('DOMContentLoaded', function () {
	        media_player.play(); // Auto-buffer.
	        media_player.pause();
	        media_player.addEventListener("timeupdate", function () {
	            for (var i = 0; i < current_links.length; i++) {
	                if (!isNaN(current_links[i])) {
	                    document.getElementById("position_" + current_links[i]).className = "";
	                }
	            }
	            var g = getClosestValues(linkers, media_player.currentTime * 1000);
	            current_links = g;
	            var a = document.getElementById("doc-scroller");
	            for (var i = 0; i < g.length; i++) {
	                if (!isNaN(g[i])) {
	                    var d = document.getElementById("position_" + g[i]);
	                    if (d != null) {
	                        d.className = "highlight";
	                        scrollToView();
	                    }
	                }
	            }
	        });
	    });
	    // @body
	    var body = '',
	        spkr = 0;
	    
	    </script> 
	</body></html>
	`
}

module.exports = buildPage;