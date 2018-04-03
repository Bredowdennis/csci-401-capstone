var id = parseAttribute('id');

const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const TRIX_EDITOR = "trix-editor";
const OUTER_CONTAINER = "outer-container";

var form;
var tagRegex = /\<\![a-z0-9_]+\>/ig;


// eventually will be an array of letter content blocks (from backend)
var state = 'Lorem ipsum this is a great student very good I love them wowza! WOWOFOFOAOSF TYPOOOO';

var editable = [];
var sections = [];
var curr_section;

document.addEventListener("trix-change", function (event) {
    //$('pre').html($(event.target).text());
    //state = (event.target).text();
});

// body
function onLoad() {
    $.ajax({
        url: 'http://localhost:3000/letter-preview/form',
        data: {id},
        type: 'GET',
        success: function (data) {
            form = data;
            console.log('success');
            var letter = createLetterPreview(form);
            sections.push(letter);
        },
        error: function () {
            console.log('error');
        }
    });
}

function showEditModal(clicked) {
    curr_section = clicked;
    state = sections[curr_section];
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);

    var element = document.querySelector(TRIX_EDITOR);
    console.log("SHOWEDITMODAL state: " + state);
    console.log("SHOWEDITMODAL curr_section: " + curr_section);
    element.value = "";
    element.editor.insertHTML(state);

    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);

    console.log("HOW ITS SAVED: " + element.value);

    state = element.value;
    sections[curr_section] = state;
    renderSelectedDisplay();

    modal.style.display = "none";
}

// Closes without changing
function cancelEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

// Updates current section innerHTML
function renderSelectedDisplay() {
    var selectedDisplayDiv = document.getElementById(curr_section);
    selectedDisplayDiv.innerHTML = state;
}

// Creates the divs for each item in array
function createLetterPreview(form) {
    var letter = document.createElement('div');
    letter.id = '0';
    letter.className = LETTER_CONTAINER_ID;
    var innerContainer = document.createElement('div');
    innerContainer.id = 'print';
    innerContainer.innerHTML = parseLetter(form);
    letter.appendChild(innerContainer);
    letter.onclick = function () {
        showEditModal(this.id);
    };
    letter.style.cursor = 'pointer';
    var outerContainer = document.getElementById(OUTER_CONTAINER);
    outerContainer.appendChild(letter);

    return letter.innerHTML;
}

function parseLetter(form) {
    var letter = form.template.text;
    var responses = form.responses;

    return letter.replace(/(?:\r\n|\r|\n)/g, '<br />').replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });

        return response.response;
    });
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '\'\'' ? null : document.currentScript.getAttribute(attr).replace(/['"]+/g, '');
}
