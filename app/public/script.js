
const urlElement = document.querySelector('.url');
const scrollerElement = document.getElementById("scroller");
const fileLectorElement = document.getElementById("fileLector");
const sepElement = document.getElementById("sep")
const fileContent = document.getElementById("fileContent");
const lectorFileName = document.getElementById("lectorFileName");

const serverUrl = "http://localhost:3000/"

let refreshRotateAngle = 0;
let showHiddenFile = false;



function getCurrentPath() {

    fetch(serverUrl + "getCurrentPath", {
        method: "POST"
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            urlElement.textContent = data.path;

            getDirectoryContents();

        })



}


function getDirectoryContents() {


    fetch(serverUrl + "getDirectoryContents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            dirPath: urlElement.textContent
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let temp = ""
            let index = 0;

            const contents = data.contents;

            contents.forEach(line => {


                if (line.name.split("")[0] == "." && !showHiddenFile) return;

                index++;

                const folder = line.isDirectory;
                const l = line.name.split(".")
                const ext = folder ? "Directory" : line.name.split(".")[l.length - 1]


                let onclick = ""

                if (folder) {
                    onclick = `
                                onclick="stepTo('${line.name}')"
                            `
                } else if (line.readable) {
                    onclick = `
                                onclick="openFile('${line.name}')"
                            `
                }


                const animation = `
                            animation: lineMove 0.5s forwards ease-out;
                            animation-delay: ${index * 0.03}s;
                            `

                const template = `
                            <div class="line" ${onclick} style="${animation}">
                                <div class="filename">${line.name}</div>
                                <div class="type">${ext}</div>
                                <div class="size">${line.size != "" ? line.size + " Kb" : ""} </div>
                            </div>
                        `

                temp += template
            })

            scrollerElement.innerHTML = temp

        });


}

function openFile(name) {
    const filePath = urlElement.textContent + "/" + name;

    fetch(serverUrl + "openFile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filePath
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const content = data.content;

            lectorFileName.textContent = name;

            fileContent.scrollTop = 0;
            fileContent.textContent = content;
            OpenFileLector();


        })
}





function toggleHiddenFile(event) {
    if (!showHiddenFile) {
        event.classList.remove("hidden");
        event.classList.add("show");
    } else {
        event.classList.add("hidden");
        event.classList.remove("show");
    }
    showHiddenFile = !showHiddenFile;

    getDirectoryContents();
}

function refresh(event) {
    refreshRotateAngle += 360;
    event.style.transform = `rotate(${refreshRotateAngle}deg)`;
    if (urlElement.textContent == "") getCurrentPath();
    getDirectoryContents();
}

function OpenFileLector() {
    fileLectorElement.classList.add("actif");
    sepElement.classList.add("actif");
}

function closeFileLector() {
    fileLectorElement.classList.remove("actif");
    sepElement.classList.remove("actif");
}

function stepTo(name) {
    urlElement.textContent += "/" + name

    getDirectoryContents();

}


function goback() {
    let dirPath = urlElement.textContent;
    let newDirPath;

    let parts = dirPath.split("/");
    parts.pop();
    newDirPath = parts.join("/");

    if (newDirPath == "") {

        let parts = dirPath.split("\\");
        parts.pop();
        newDirPath = parts.join("\\");
    }

    urlElement.textContent = newDirPath;
    getDirectoryContents();
}


getCurrentPath();
