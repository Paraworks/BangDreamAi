document.getElementById('chat-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const input = document.getElementById('user-input');
    const message = input.value;
    input.value = '';
    await sendMessage(message);
});

async function sendMessage(message) {
    const sessionId = 'test'; 
    const modelPath = '/static/Resources/001_2018_halloween/model.json';

    try {
        const modelDataResponse = await fetch(modelPath); // 从服务器获取模型数据
        const modelData = await modelDataResponse.json();
        const motions = Object.keys(modelData.motions || {});
        const expressions = (modelData.expressions || []).map(exp => exp.name);

        const chatData = { message, modelPath, motions, expressions };

        const response = await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatData)
        });
        const chatResponse = await response.json();
        if (chatResponse.success) {
            displayResponse(chatResponse.text, chatResponse.motion, chatResponse.expression);
        } else {
            console.error("Error sending message");
        }
    } catch (error) {
        console.error("Error sending message: ", error);
    }
}
document.addEventListener('DOMContentLoaded', function(){
    fetch('/api/content/test/init/1')
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('user-config-form');
        for (var key in data) {
            var label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = key + ': ';

            var input = document.createElement('input');
            input.type = 'text';
            input.id = key;
            input.name = key;
            input.value = data[key];

            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement('br'));
        }

        // Add a submit button to the form
        var submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Confirm Changes';
        form.appendChild(submitButton);
    });
});

document.getElementById('user-config-form').addEventListener('submit', function(event){
    event.preventDefault();
    var formData = {};
    var formElements = this.elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].name) {
            formData[formElements[i].name] = formElements[i].value;
        }
    }
    fetch('/api/content/test/init/1', {  // Update this URL to your actual endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Configuration updated!');
    })
    .catch(error => console.error('Error:', error));
});


document.addEventListener('DOMContentLoaded', function(){
    fetch('/api/editor/test/init')
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('article-editor-form');
        var contents = data.contents;
        for (var sentenceId in contents) {
            fetch('/api/content/test/init/' + sentenceId)
            .then(response => response.json())
            .then(sentenceData => {
                var label = document.createElement('label');
                label.htmlFor = sentenceId;
                label.textContent = 'Sentence ' + sentenceId + ': ';

                var input = document.createElement('input');
                input.type = 'text';
                input.id = sentenceId;
                input.name = sentenceId;
                input.value = sentenceData.text;

                form.appendChild(label);
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
            });
        }
    });
});

document.getElementById('article-editor-form').addEventListener('submit', function(event){
    event.preventDefault();
    var formData = new FormData(this);
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Article updated!');
    })
    .catch(error => console.error('Error:', error));
});

var currentVisible = 'chat-container';
var nextVisible = {
    'chat-container': 'user-config-container',
    'user-config-container': 'article-editor-container',
    'article-editor-container': 'chat-container'
};

document.getElementById('btn-toggle').addEventListener('click', function() {
    document.getElementById(currentVisible).style.display = 'none';
    currentVisible = nextVisible[currentVisible];
    document.getElementById(currentVisible).style.display = 'block';
});

document.getElementById('user-config-container').style.display = 'none';
document.getElementById('article-editor-container').style.display = 'none';
