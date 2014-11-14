// ==UserScript==
// @name         Github Linkifier
// @namespace
// @version      0.1
// @description
// @author       Nathan Johnstone
// @include      https://github.com/*/pull/*
// @grant        none
// ==/UserScript==
/* global unsafeWindow */

String.format = function(string)
{
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    return string.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
};

/*
 * Split a text string by occurrences of the regular expression for
 * target process numbers
 */
function splitTextByTargetProcessNumbers(text)
{
    var re = /(TP.\d+)/g;

    retval = text.split(re);

    // Remove empty strings from the array
    retval = retval.filter(function(n){ return n != "" });

    return retval;
};

/*
 * Return a link element with an href to the specified target process
 * numbers and the innerHTML text set to TP with the type and number
 */
function createTargetProcessLink(tpType, tpNumber)
{
    // Create the Target Process link
    var tpLink = document.createElement('a');
    tpLink.setAttribute("href", String.format("http://tp.boardbooks.com/TargetProcess2/entity/{0}", tpNumber));
    tpLink.innerHTML = String.format("TP{0}{1}", tpType, tpNumber);

    return tpLink;
};

/*
 * Check if the text is a target process number and return information
 * as an object with the following
 * - isTargetProcessNumber
 * - tpType
 * - tpNumber
 */
function CheckTargetProcessNumber(text)
{
    var re = /(.*)(TP|tp)(.)(\d+)(.*)/g;
    var result = re.exec(text);

    if (result == null)
    {
        this.isTargetProcessNumber = false;
        this.tpType = null;
        this.tpNumber = null;
    }
    else
    {
        this.isTargetProcessNumber = true;
        this.tpType = result[3];
        this.tpNumber = result[4];
    }

    return this;
};

/*
 * Append a target process hyperlink as a child of the span
 */
function appendTargetProcessLink(span, tpResult)
{
    var tpType = tpResult.tpType;
    var tpNumber = tpResult.tpNumber;

    var tpLink = createTargetProcessLink(tpType, tpNumber);
    //tpLink.class = String.format(".tp.", tpNumber);
    //tpLink.id = "tp";
    tpLink.className = String.format("tp{0}", tpNumber);

    span.appendChild(tpLink);
};

/*
 * Create a span with the text and append as a child of the span
 */
function appendTextAsSpan(span, text)
{
    var newSpan = document.createElement('span');
    newSpan.textContent = text;
    span.appendChild(newSpan);
};

function replaceTargetProcessNumbersWithLinksInSpan(span)
{
    var textContent = span.textContent;
    var re = /(.*)(TP|tp)(.)(\d+)(.*)/g;

    var textContentSplits = splitTextByTargetProcessNumbers(textContent);

    if (textContentSplits.length <= 1)
    {
        return span.cloneNode(true);
    }

    var returnSpan = document.createElement('span');

    for (i=0; i < textContentSplits.length ; i++)
    {
        var result = CheckTargetProcessNumber(textContentSplits[i]);

        if (result.isTargetProcessNumber)
        {
            appendTargetProcessLink(returnSpan, result);
        }
        else
        {
            appendTextAsSpan(returnSpan, textContentSplits[i]);
        }
    }

    return returnSpan;
};

function replaceTargetProcessNumbersWithLinksInParagraph(paragraph)
{
    var textContent = paragraph.textContent;
    var re = /(.*)(TP|tp)(.)(\d+)(.*)/g;

    var textContentSplits = splitTextByTargetProcessNumbers(textContent);

    if (textContentSplits.length <= 1)
    {
        return paragraph.cloneNode(true);
    }

    var returnParagraph = document.createElement('p');

    for (i=0; i < textContentSplits.length ; i++)
    {
        var result = CheckTargetProcessNumber(textContentSplits[i]);

        if (result.isTargetProcessNumber)
        {
            appendTargetProcessLink(returnParagraph, result);
        }
        else
        {
            appendTextAsSpan(returnParagraph, textContentSplits[i]);
        }
    }

    return returnParagraph;
};

function replaceNode(targetNode, newNode)
{
    targetNode.parentNode.insertBefore(newNode, targetNode);
    targetNode.remove();
};

function replaceJsIssueTitle(doc)
{
    var targetElement = doc.querySelector(".js-issue-title");

    if (targetElement !== null)
    {
        var newSpan = replaceTargetProcessNumbersWithLinksInSpan(targetElement);
        newSpan.className = "js-issue-title";

        replaceNode(targetElement, newSpan);
    }
};

function replaceComments(doc)
{
    var targetDivs = doc.querySelectorAll(".comment-body");

    for (var d=0; d < targetDivs.length; d++)
    {
        var targetDiv = targetDivs[d];
        var targetParagraphs = targetDiv.querySelectorAll("p");

        for (var i=0 ; i < targetParagraphs.length; i++)
        {
            var targetElement = targetParagraphs[i];
            if (targetElement !== null)
            {
                var newElement = replaceTargetProcessNumbersWithLinksInParagraph(targetElement);

                newElement.innerHTML = newElement.innerHTML.replace(/\n/g, '<br/>');
                replaceNode(targetElement, newElement);
            }
        }
    }


};


(function (unsafeWindow) {

    function init()
    {
        replaceJsIssueTitle(document);
        replaceComments(document);
    };

    init();

    // on pjax;
    unsafeWindow.$(document).on("pjax:end", init);  // `pjax:end` also runs on history back;

})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);