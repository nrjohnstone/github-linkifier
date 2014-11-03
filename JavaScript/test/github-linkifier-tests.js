/**
 * Created by Nathan Johnstone on 26/10/2014.
 */

TestCase("replaceComments", {
    "test when expression not present should not alter text in paragraph": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment with no expression</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        assertEquals("\n         Test comment with no expression\n         "
            , document.querySelector(".comment-body").textContent);
    },
    "test when expression present should add link": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment with no expression TPU123456</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var child = document.querySelector(".tp123456");

        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, child.getAttribute("href"));
    },
    "test when expression present should add span within paragraph": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment with no expression TPU123456</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var targetDiv = document.querySelector(".comment-body");

        assertEquals("p", targetDiv.children[0].tagName.toLowerCase());
        assertEquals("span", targetDiv.children[0].children[0].tagName.toLowerCase());
        assertEquals("a", targetDiv.children[0].children[1].tagName.toLowerCase());
    },
    "test when multiple paragraphs with expression present should add link for each": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment TPU256705 with a new paragraph here.</p>
         <p>And another TPU99999 link here.</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var tplink1 = document.querySelector(".tp256705");
        var tplink2 = document.querySelector(".tp99999");

        var expectedHref1 = "http://tp.boardbooks.com/TargetProcess2/entity/256705";
        var expectedHref2 = "http://tp.boardbooks.com/TargetProcess2/entity/99999";
        assertEquals(expectedHref1, tplink1.getAttribute("href"));
        assertEquals(expectedHref2, tplink2.getAttribute("href"));
    },
    "test when multiple paragraphs with expression present should not change text content": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment TPU256705 with a new paragraph here.</p>
         <p>And another TPU99999 link here.</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var targetDiv = document.querySelector(".comment-body");
        assertEquals("\n         Test comment TPU256705 with a new paragraph here.\n         And another TPU99999 link here.\n         ", targetDiv.textContent);
    },
    "test when multiple comments with expression present should add links": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment with no expression TPU123456</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Later comment with another TPU789789 number</p>
         </div>
         </div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var tplink1 = document.querySelector(".tp123456");
        var tplink2 = document.querySelector(".tp789789");

        var expectedHref1 = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        var expectedHref2 = "http://tp.boardbooks.com/TargetProcess2/entity/789789";
        assertEquals(expectedHref1, tplink1.getAttribute("href"));
        assertEquals(expectedHref2, tplink2.getAttribute("href"));
    },
    "test when multiple comments with same expression number present should add links": function () {
        /*:DOC +=
         <div class="comment-content">
         <p class="comment-form-stale">
         The content you are editing has changed. Reload the page and try again.
         </p>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Test comment with no expression TPU123456</p>
         </div>
         </div>
         <div class="context-loader">Sending request…</div>
         <div class="edit-comment-hide">
         <div class="comment-body markdown-body markdown-format js-comment-body">
         <p>Later comment with another TPU123456 number</p>
         </div>
         </div>
         </div>
         */

        // Act
        replaceComments(document);

        // Assert
        var tplinks = document.querySelectorAll(".tp123456");

        assertEquals(2, tplinks.length);
    }
});

TestCase("replaceTargetProcessNumbersWithLinksInParagraphTests", {
    "test no expression is present should return paragraph unchanged": function ()
    {
        var testParagraph = document.createElement('p');

        testParagraph.textContent = "Some github title text with";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInParagraph(testParagraph);

        // Assert
        assertEquals("Some github title text with", actual.textContent);
    },
    "test expression is present should return paragraph with link": function ()
    {
        var testParagraph = document.createElement('p');

        testParagraph.textContent = "Some github title text with TPU123456";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInParagraph(testParagraph);

        // Assert
        var child = actual.querySelector(".tp123456");

        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, child.getAttribute("href"));
    },
    "test expression is present should return correct paragraph text": function ()
    {
        var testParagraph = document.createElement('p');

        testParagraph.textContent = "Some github title text with TPU123456";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInParagraph(testParagraph);

        // Assert
        assertEquals("Some github title text with TPU123456", actual.textContent);
    }

});

TestCase("replaceJsIssueTitleTests", {
    "test when expression not present should not alter text in span": function ()
    {
        /*:DOC +=
         <div class="gh-header-show ">
         <div class="gh-header-actions">
         <button type="button" class="minibutton js-details-target">Edit</button>

         <a href="/csnate/cctray-jenkins-transport/issues/new" class="minibutton primary" data-hotkey="c">
         New issue
         </a>
         </div>

         <h1 class="gh-header-title">
         <span class="js-issue-title">Extra tests for JenkinsServerManager</span>
         <span class="gh-header-number">#6</span>
         </h1>
         </div>
         */
//
        // Act
        replaceJsIssueTitle(document);

        // Assert
        assertEquals("Extra tests for JenkinsServerManager", document.querySelector(".js-issue-title").textContent);
    },

    "test when expression is present at end should not alter the text": function ()
    {
        /*:DOC +=
         <div class="gh-header-show ">
         <div class="gh-header-actions">
         <button type="button" class="minibutton js-details-target">Edit</button>

         <a href="/csnate/cctray-jenkins-transport/issues/new" class="minibutton primary" data-hotkey="c">
         New issue
         </a>
         </div>

         <h1 class="gh-header-title">
         <span class="js-issue-title">Some github title text with TPU123456</span>
         <span class="gh-header-number">#6</span>
         </h1>
         </div>
         */
//
        // Act
        replaceJsIssueTitle(document);

        // Assert
        assertEquals("Some github title text with TPU123456", document.querySelector(".js-issue-title").textContent);
    },

    "test when expression is present at end should append a link within span": function ()
    {
        /*:DOC +=
         <div class="gh-header-show ">
         <div class="gh-header-actions">
         <button type="button" class="minibutton js-details-target">Edit</button>

         <a href="/csnate/cctray-jenkins-transport/issues/new" class="minibutton primary" data-hotkey="c">
         New issue
         </a>
         </div>

         <h1 class="gh-header-title">
         <span class="js-issue-title">Some github title text with TPU123456</span>
         <span class="gh-header-number">#6</span>
         </h1>
         </div>
         */
//
        // Act
        replaceJsIssueTitle(document);

        // Assert
        tpElement = document.querySelector(".tp123456");

        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, tpElement.getAttribute("href"));
    }
});

TestCase("replaceTargetProcessNumbersWithLinksInSpanTestes", {
    "test when expression not present should not alter text in span": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "Some github title text with";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        assertEquals("Some github title text with", actual.textContent);
    },

    "test when expression is present at end should not alter the text": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "Some github title text with TPU123456";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        assertEquals("Some github title text with TPU123456", actual.textContent);
    },

    "test when expression is present at end should append a link within span": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "Some github title text with TPU123456";

        var expected = document.createElement('a');

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        var child = actual.querySelector(".tp123456");
        //var child = actual.lastChild;

        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, child.getAttribute("href"));
    },

    "test when expression is present at start should prepend a link within span": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "TPU123456 issue and some extra text";

        var expected = document.createElement('a');

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        var child = actual.firstChild;

        //jstestdriver.console.log(child);
        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, child.getAttribute("href"));
    },

    "test when expression is present at start should not alter the text": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "TPU123456 issue and some extra text";

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        assertEquals("TPU123456 issue and some extra text", actual.textContent);
    },

    "test when expression is present at start and end should add link for end issue": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "TPU123456 issue and some extra text and also TPU55555";

        var expected = document.createElement('a');

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        var child = actual.lastChild;

        //jstestdriver.console.log(child);
        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/55555";
        assertEquals(expectedHref, child.getAttribute("href"));
    },

    "test when expression is present at start and end should add link for start issue": function ()
    {
        var testSpan = document.createElement('span');

        testSpan.textContent = "TPU123456 issue and some extra text and also TPU55555";

        var expected = document.createElement('a');

        // Act
        var actual = replaceTargetProcessNumbersWithLinksInSpan(testSpan);

        // Assert
        var child = actual.firstChild;

        //jstestdriver.console.log(child);
        var expectedHref = "http://tp.boardbooks.com/TargetProcess2/entity/123456";
        assertEquals(expectedHref, child.getAttribute("href"));
    }
});

TestCase("splitTextByTargetProcessNumbersTests", {
    "test when expression not present should return array with count of 1": function () {
        textContent = "Some github title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals(1, actual.length);
    },

    "test when expression not present should return array with original text": function () {
        textContent = "Some github title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals("Some github title text with", actual[0]);
    },

    "test when expression is present in end should return array with count of 2": function () {
        textContent = "Some github title text with TPU123456";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals(2, actual.length);
    },

    "test when expression is present a start should return array with count of 2": function () {
        textContent = "TPU123456 Some github title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);
        jstestdriver.console.log(actual);
        // Assert
        assertEquals(2, actual.length);
    },

    "test when expression is present in middle should return array with count of 3": function () {
        textContent = "Some github TPU123456 title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals(3, actual.length);
    },

    "test when expression is present in middle should return array position 1 correct": function () {
        textContent = "Some github TPU123456 title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals("Some github ", actual[0]);
    },

    "test when expression is present in middle should return array position 2 correct": function () {
        textContent = "Some github TPU123456 title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals("TPU123456", actual[1]);
    },

    "test when expression is present in middle should return array position 3 correct": function () {
        textContent = "Some github TPU123456 title text with";

        // Act
        var actual = splitTextByTargetProcessNumbers(textContent);

        // Assert
        assertEquals(" title text with", actual[2]);
    }
});

