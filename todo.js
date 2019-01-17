let g_toDoList = [];                    ///<투두 리스트 저장한 리스트
const g_TODO_LOCAL_STORAGE= "TODO_LS";  ///<로컬 스토리지 킷 값

/**
 * @brief todo todo 엘레먼트의 상태를 변경하는 경우
 */
function HandleChangeToDoState(event){

    const stateBtn =event;
    let result;

    if( stateBtn.innerHTML =="예정"){

        stateBtn.innerHTML ="진행";
        result="진행";
    }

    else if( stateBtn.innerHTML =="진행"){

        stateBtn.innerHTML ="완료";
        result= "완료";
    }

    else if( stateBtn.innerHTML =="완료"){

        stateBtn.innerHTML ="예정";
        result ="예정";
    }

    var id=stateBtn.id;
    for(var i = 0 ; i < g_toDoList.length; i++){

        if( g_toDoList[i].id== id){

            g_toDoList[i].state = result;
            break;
        }
    }

    localStorage.setItem(g_TODO_LOCAL_STORAGE, JSON.stringify(g_toDoList));
}    

/**
 * @brief todo 아코디언 헤더를 누른 경우
 */
function HandleClickAccordionHead(num){

    const accordionId= `accordion-${num}`;
    const accordionDiv = document.getElementById(accordionId);
    const accordionBody = accordionDiv.querySelector('#accordion-body');
    const accordionDisplay = window.getComputedStyle(accordionBody,null).display;

    if('none' === accordionDisplay){
        accordionBody.setAttribute('class', 'active');
    }
    else{
        accordionBody.removeAttribute('class');
    }
}

/**
 * @brief todo 엘레먼트에서 삭제 버튼을 누른 경우
 */
function HandleDeleteToDoElement(val){

    const g_toDoList = document.getElementById("accordion-list");
    const delBtn = event.target;
    g_toDoList.removeChild( delBtn.parentNode.parentNode );

    const newToDoList = g_toDoList.filter(function(toDoElement){
        return parseInt(val) !== parseInt(toDoElement.id);
    });

    g_toDoList= newToDoList;

    localStorage.setItem(g_TODO_LOCAL_STORAGE, JSON.stringify(g_toDoList));
}

/**
 * @brief todoList에 엘레멘트를 추가하는 경우
 */
function createToDoElement(){

    const countTotalAccordion= document.getElementById("accordion-list").children.length;

    const newAccodion = document.createElement("div");
    newAccodion.id=`accordion-${countTotalAccordion}`;

    //투두 리스트 헤더 생성
    const newAccordionHead = document.createElement("div");
    newAccordionHead.id="accordion-header";
    newAccordionHead.onclick= function(){
        HandleClickAccordionHead(countTotalAccordion);
    };
    const accordionHeadText = document.getElementById("craete-accordion-header").value;
    newAccordionHead.innerText= accordionHeadText;

    //투두 리스트 보디 생성
    const newAccordionBody = document.createElement("div");
    newAccordionBody.id="accordion-body";

    //해당 투두 제거 버튼 생성
    const delBtn = document.createElement("button");
    delBtn.id=countTotalAccordion;
    delBtn.innerHTML="x";
    delBtn.addEventListener("click", function(){

        HandleDeleteToDoElement(this.id);
    });
    newAccordionBody.appendChild(delBtn);


    //상태 표시 및 상태 변경 버튼 생성
    const stateBtn = document.createElement("button");
    stateBtn.id=countTotalAccordion;
    stateBtn.innerHTML="예정";
    stateBtn.addEventListener("click", function(){

        HandleChangeToDoState(this);
    });
    newAccordionBody.appendChild(stateBtn);



    //투두 리스트 span 생성
    const todoSpan = document.createElement("span");
    const toDoExplain = document.getElementById("craete-accordion-body").value;
    todoSpan.innerHTML =  toDoExplain;
    newAccordionBody.appendChild(todoSpan);

    //DOM 삽입
    newAccodion.appendChild(newAccordionHead);
    newAccodion.appendChild(newAccordionBody);
    
    document.getElementById("accordion-list").appendChild(newAccodion);


    //toDoLiST에 삽입
    const todoElementObj = {
        title : accordionHeadText,
        explain : toDoExplain,
        id : countTotalAccordion,
        state : "예정"
    }

    g_toDoList.push(todoElementObj);


    //localStorage에 갱신
    localStorage.setItem(g_TODO_LOCAL_STORAGE, JSON.stringify(g_toDoList));
}

/**
 * @brief 로드 시 toDoList에 삽입하는 경우
 */
function loadToDoElement(id, title, explain, state){

    const countTotalAccordion= id;

    const newAccodion = document.createElement("div");
    newAccodion.id=`accordion-${countTotalAccordion}`;

    //투두 리스트 헤더 생성
    const newAccordionHead = document.createElement("div");
    newAccordionHead.id="accordion-header";
    newAccordionHead.onclick= function(){
        HandleClickAccordionHead(countTotalAccordion);
    };
    const accordionHeadText = title;
    newAccordionHead.innerText= accordionHeadText;

    //투두 리스트 보디 생성
    const newAccordionBody = document.createElement("div");
    newAccordionBody.id="accordion-body";

    //해당 투두 제거 버튼 생성
    const delBtn = document.createElement("button");
    delBtn.id=countTotalAccordion;
    delBtn.innerHTML="X";
    delBtn.addEventListener("click", function(){

        HandleDeleteToDoElement(this.id);
    });
    newAccordionBody.appendChild(delBtn);


    //상태 표시 및 상태 변경 버튼 생성
    const stateBtn = document.createElement("button");
    stateBtn.id=countTotalAccordion;
    stateBtn.innerHTML=state;
    stateBtn.addEventListener("click", function(){
   
       HandleChangeToDoState(this);
    });
    newAccordionBody.appendChild(stateBtn);
   

    //투두 리스트 span 생성
    const todoSpan = document.createElement("span");
    const toDoExplain = explain;
    todoSpan.innerHTML =  toDoExplain;
    newAccordionBody.appendChild(todoSpan);

    //DOM에 생성 엘레먼트 삽입
    newAccodion.appendChild(newAccordionHead);
    newAccodion.appendChild(newAccordionBody);

    document.getElementById("accordion-list").appendChild(newAccodion);


    //toDoLiST에 삽입
    const todoElementObj = {
        id : countTotalAccordion,
        title : accordionHeadText,
        explain : toDoExplain
    }

    g_toDoList.push(todoElementObj);

}


/**
 * brief 로컬 스토리지에 저장된 기존 todo 목록을 불러온다.
 */
function loadToDoFromLocalStorage(){

    const initToDoList= JSON.parse( localStorage.getItem(g_TODO_LOCAL_STORAGE) );

    if( initToDoList!==null){
        
        initToDoList.forEach(function(toDoElement){
            loadToDoElement(toDoElement.id, toDoElement.title, toDoElement.explain, toDoElement.state);
        });

        g_toDoList= initToDoList;
    }

    

}

function init(){

    loadToDoFromLocalStorage();
}

init();