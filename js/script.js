(function fileExplorer() {
    var mainFolder;
    var files;

    window.onload = function () {
        getFiles(startWorking);
    };


    function CreateDomElement(type, name, parentPath) {
        this.type = type;
        this.name = name;
        this.parentPath = parentPath;
        if (this.type === 'folder') {
            this.children = [];
        }
        this.addDomElement = function () {
            var parentNode, childNode, span;

            parentNode = document.getElementById(this.parentPath).lastChild;
            childNode = document.createElement('li');
            childNode.id = this.parentPath + '/' + this.name;

            parentNode.appendChild(childNode);

            span = document.createElement('span');
            childNode.appendChild(span);
            span.innerHTML = name;

            span.addEventListener('click', function () {

                this.parentNode.children[4].style.display = (this.parentNode.children[4].style.display == 'none') ? 'block' : 'none';
            });

            if (this.type === 'folder') {
                childNode.className = 'folder';

                childNode.style.backgroundImage = 'url("' + 'images/Folder-icon.png' + '")';
                childNode.style.backgroundSize = '14px';

                addButton('images/delete.png', childNode, 'del' + childNode.id);
                deleteDomElementBehaviour('del' + childNode.id);

                addButton('images/folder.png', childNode, 'fol' + childNode.id);

                addButton('images/file.png', childNode, 'file' + childNode.id);


            } else if(this.type === 'file') {
                childNode.className = 'file';

                childNode.style.backgroundImage = 'url("' + 'images/File-icon.png' + '")';
                childNode.style.backgroundSize = '14px';

                addButton('images/delete.png', childNode, 'del' + childNode.id);
            }
        };

    }

    function addButton(imgSrc, childNode, id) {
        var element, img;
        element = document.createElement('button');
        element.id = id;

        img = element.appendChild(document.createElement('img'));
        img.src = imgSrc;
        img.style.width = '13px';

        childNode.insertBefore(element, childNode.children[1]);
    }

    function deleteDomElementBehaviour(buttonId){
        var button = document.getElementById(buttonId);
        button.addEventListener('click', function () {

            var elementToDelete = this.parentNode;
            var parent = elementToDelete.parentNode;
            parent.removeChild(elementToDelete);
        });
    }

    function createDomElementBehaviour(buttonId, createFunc) {
        var button = document.getElementById(buttonId);
        button.addEventListener('click', function () {
            createFunc();
        });

    }

    


    /**
     * function to get data from JSON
     * @param callback Function to init after data has got
     */
    function getFiles(callback) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    callback(JSON.parse(req.responseText)[0])
                }
                else {
                    console.log("Error on getting files list");
                }
            }
        };
        req.open('GET', 'db/files.json', true);
        req.send();
    }


    /**
     * work initialized
     */
    function startWorking(myFiles) {
        files = myFiles;
        createRootElement();
        createTree(mainFolder, files);
        createNavigation();
        createIcons();
        addHideElementsBehaviour();
        createBehaviour();
    }

    /**
     * Add our DOM to container
     * @param container - where to create file explorer
     * @param obj - parsed Json
     */
    function createTree(container, obj) {
        container.appendChild(createTreeDom(obj));
    }


    function createRootElement() {
        var span, mainUl;

        mainUl = document.createElement('ul');
        mainUl.id = 'mainUl';

        mainFolder = document.createElement('li');
        mainFolder.className = files.type;
        mainFolder.id = files.path;

        span = (document.createElement('span'));
        mainFolder.insertBefore(span, mainFolder.firstChild);
        span.innerHTML = files.name;

        document.getElementById('explorer').appendChild(mainUl).appendChild(mainFolder);
    }

    /**
     * Create DOM
     * @param obj - parsed Json
     */
    function createTreeDom(obj) {
        if (!isObjectEmpty(obj)) {
            var ul, i, li, span, childrenUl;

            ul = document.createElement('ul');

            for (i = 0; i < obj.children.length; i++) {
                li = document.createElement('li');
                li.className = obj.children[i].type;
                li.id = obj.children[i].path;

                span = (document.createElement('span'));
                li.insertBefore(span, li.firstChild);
                span.innerHTML = obj.children[i].name;

                childrenUl = createTreeDom(obj.children[i]);
                if (childrenUl) li.appendChild(childrenUl);

                ul.appendChild(li);
            }
        }
        return ul;
    }


    function createNavigation() {
        addElementToNavigation('folder', 'images/delete.png', 'del', 'delete');
        addElementToNavigation('folder', 'images/folder.png', 'fol', 'newFolder');
        addElementToNavigation('folder', 'images/file.png', 'file', 'newFile');
        addElementToNavigation('file', 'images/delete.png', 'del', 'delete');
    }

    function createIcons() {
        addIconToElement("http://icons.iconarchive.com/icons/hopstarter/sleek-xp-basic/16/Folder-icon.png", 'folder');
        addIconToElement("http://findicons.com/files/icons/2015/24x24_free_application/24/text.png", 'file');
    }

    function createBehaviour() {
        addBehaviour('delete', deleteElementByPath);
        addBehaviour('newFolder', createFolderByPath);
        addBehaviour('newFile', createFileByPath);
    }

    /**
     * test
     */
    function isObjectEmpty(obj) {
        return !obj.children;
    }

    /**
     * @param imgUrl
     * @param className - folder or file
     */
    function addIconToElement(imgUrl, className) {
        var array = document.getElementsByClassName(className);
        [].forEach.call(array, function addBackgroundFile(item) {

            item.style.backgroundImage = 'url("' + imgUrl + '")';
            item.style.backgroundSize = '14px';
        });
    }

    /**
     * @param tag - create element with <tag>
     * @param parentClass - create this element in element with parentClass
     * @param src - url to the image
     * @param id - add id to this element
     * @param newClass - add class to this element
     */
    function addElementToNavigation(parentClass, src, id, newClass) {
        var allParents, element, img, i;

        allParents = document.getElementsByClassName(parentClass);
        for (i = 0; i < allParents.length; i++) {

            element = document.createElement('button');
            element.id = id + allParents[i].id;
            element.className = newClass;

            img = element.appendChild(document.createElement('img'));
            img.src = src;
            img.style.width = '13px';

            allParents[i].insertBefore(element, allParents[i].children[1]);
        }
    }

    /**
     * add Event Listeners to Elements(hide children by click)
     */
    function addHideElementsBehaviour() {
        var spans, i;
        spans = document.getElementsByTagName('span');
        for (i = 0; i < spans.length; i++) {

            spans[i].addEventListener('click', function () {

                this.parentNode.children[4].style.display = (this.parentNode.children[4].style.display == 'none') ? 'block' : 'none';
            })
        }
    }

    function addBehaviour(buttonClass, functionCreate) {
        var behaviourButtons, i, elementPath, explorer;

        behaviourButtons = document.getElementsByClassName(buttonClass);
        for (i = 0; i < behaviourButtons.length; i++) {

            behaviourButtons[i].addEventListener('click', function () {

                elementPath = this.parentNode.id;
                functionCreate(files, elementPath);

                // explorer = document.getElementById('explorer');
                //
                // while (explorer.firstChild) {
                //     explorer.removeChild(explorer.firstChild);
                // }

                // startWorking(files);
            })
        }
    }

    /**
     * delete Element with specified path
     */
    function deleteElementByPath(obj, pathToFind) {
        if (obj.path == pathToFind) {
            alert('You can not delete root folder!');

        } else if (obj.children) {

            for (var i = 0; i < obj.children.length; i++) {

                if (obj.children[i].path == pathToFind) {
                    obj.children.splice(i, 1);
                } else
                    deleteElementByPath(obj.children[i], pathToFind);
            }
            return obj;
        }

    }

    /**
     * @constructor for Folder
     */
    function ObjectFolder(type, name, path, children) {
        this.type = type;
        this.name = name;
        this.path = path;
        this.children = children;
    }

    /**
     * create Folder in specified path
     */
    function createFolderByPath(obj, pathToFind) {
        var nameOfFolder, folder, i, myElement;

        if (obj.path == pathToFind) {

            nameOfFolder = prompt('Enter name of folder', '');
            if (nameOfFolder === null) {
                return;
            }

            myElement = new CreateDomElement('folder', nameOfFolder, pathToFind);
            myElement.addDomElement();

            folder = new ObjectFolder('folder', nameOfFolder, obj.path + '/' + nameOfFolder, []);
            obj.children.push(folder);

        } else if (obj.children) {

            for (i = 0; i < obj.children.length; i++) {

                if (obj.children[i].path == pathToFind) {

                    nameOfFolder = prompt('Enter name of folder', '');
                    if (nameOfFolder === null) {
                        return;
                    }

                    myElement = new CreateDomElement('folder', nameOfFolder, pathToFind);
                    myElement.addDomElement();

                    folder = new ObjectFolder('folder', nameOfFolder, obj.children[i].path + '/' + nameOfFolder, []);
                    obj.children[i].children.push(folder);

                } else  createFolderByPath(obj.children[i], pathToFind);
            }
            return obj;
        }

    }

    /**
     * @constructor for File
     */
    function ObjectFile(type, name, path) {
        this.type = type;
        this.name = name;
        this.path = path;
    }


    /**
     *  create File in specified path
     */
    function createFileByPath(obj, pathToFind) {
        var nameOfFile, file, i, myElement;

        if (obj.path == pathToFind) {

            nameOfFile = prompt('Enter name of file', '');
            if (nameOfFile === null) {
                return;
            }

            myElement = new CreateDomElement('file', nameOfFile, pathToFind);
            myElement.addDomElement();

            file = new ObjectFile('file', nameOfFile, obj.path + '/' + nameOfFile);
            obj.children.push(file);

        } else if (obj.children) {

            for (i = 0; i < obj.children.length; i++) {
                if (obj.children[i].path == pathToFind) {

                    nameOfFile = prompt('Enter name of file', '');
                    if (nameOfFile === null) {
                        return;
                    }

                    myElement = new CreateDomElement('file', nameOfFile, pathToFind);
                    myElement.addDomElement();

                    file = new ObjectFile('file', nameOfFile, obj.children[i].path + '/' + nameOfFile);
                    obj.children[i].children.push(file);

                } else  createFileByPath(obj.children[i], pathToFind);
            }
        }
    }

})();



