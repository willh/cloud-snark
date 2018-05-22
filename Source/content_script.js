console.log("HELLO WORLD");

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
		v = v.replace(/\bprivate cloud/g, "datacentre");
		v = v.replace(/\bPrivate cloud/g, "Datacentre");
		v = v.replace(/\bPrivate Cloud/g, "Datacentre");
		v = v.replace(/\bhybrid cloud\b/g, "datacentre connected to Azure ActiveDirectory");
		v = v.replace(/\bHybrid cloud\b/g, "Datacentre connected to Azure ActiveDirectory");
		v = v.replace(/\bHybrid Cloud\b/g, "Datacentre connected to Azure ActiveDirectory");
		v = v.replace(/\bhybrid clouds/g, "datacentres connected to Azure ActiveDirectory");
		v = v.replace(/\bHybrid clouds/g, "Datacentres connected to Azure ActiveDirectory");
		v = v.replace(/\bHybrid Clouds/g, "Datacentres connected to Azure ActiveDirectory");

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
   (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
               node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
console.log("DONE WORLD");
