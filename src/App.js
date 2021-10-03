import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js';
import Sidebar from './components/Sidebar.js';
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js';
import jsTPS from "./common/jsTPS.js";
import ChangeItem_Transaction from "./transactions/ChangeItem_Transaction.js";
import MoveItem_Transaction from "./transactions/MoveItem_Transaction.js";

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();
        
        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData
        }
    }
    
    componentDidMount() {
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'z') {
                this.undo(); //why cant do that; arrow function save me yay
            }
        });
        window.addEventListener('keydown', (event) =>  {
            if (event.ctrlKey && event.key === 'y') {
                this.redo();
            }
        });
    }
    componentWillUnmount() { //i think it's unnecessary since app unmount = exit page, but for completeness
        window.removeEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'z') {
                this.undo(); //why cant do that
            }
        });
        window.removeEventListener('keydown', (event) =>  {
            if (event.ctrlKey && event.key === 'y') {
                this.redo();
            }
        });
    }
    
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            //this.view.updateToolbarButtons(this);
        }
    }
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            //this.view.updateToolbarButtons(this);
        }
    }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = ""+this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameItem = (key, newName) => {
        if(newName === ""){
            newName =  "?";
        }
        let oldName = this.state.currentList.items[key];
        if(newName !== oldName){
            let transaction = new ChangeItem_Transaction(this, key, oldName, newName);
            this.tps.addTransaction(transaction);
            //this.view.updateToolbarButtons(this);
        } else{
            this.changeItem(this.key, this.newName);
            //this.view.updateToolbarButtons(this);
        }
    }
    changeItem(key, newName) {
        let list = this.state.currentList;
        if(list!==null){
            list.items[key] = newName;
            this.setState(prevState => ({
                currentList: list,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: prevState.sessionData.keyNamePairs
                }
            }), () => {
                //this.state.currentList.items[key] = newName;
                this.db.mutationUpdateList(this.state.currentList);
                this.loadList(this.state.currentList.key);
            });
        }
    }

    swapItem = (oldIndex, newIndex) => {
        //console.log("dropping " +this.state.currentList.items[oldIndex] + " to new index " + this.state.currentList.items[newIndex]);
        let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
        this.tps.addTransaction(transaction);
    }
    moveItem(oldIndex, newIndex){
        let list = this.state.currentList;
        if(list!==null){
            list.items.splice(newIndex, 0, list.items.splice(oldIndex, 1)[0]); //set to own function
            //addmoveitemtranstiaonc
            this.setState(prevState => ({
                currentList: list,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: prevState.sessionData.keyNamePairs
                }
            }), () => {
                //this.state.currentList.items[key] = newName;
                this.db.mutationUpdateList(this.state.currentList);
                this.loadList(this.state.currentList.key);
            });
        }
    }
    
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS? TODO?
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        if(this.state.currentList){ //Just in case closing leads to bugs if there are no list
            this.setState(prevState => ({
                currentList: null,
                listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
                sessionData: this.state.sessionData
            }), () => {
                // ANY AFTER EFFECTS?
                this.tps.clearAllTransactions();
            });
        } else{ //idk ill leave it here
            
        }
    }
    confirmedDeleteList = () =>{
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (this.state.listKeyPairMarkedForDeletion.key === pair.key) {
                newKeyNamePairs.splice(i, 1);
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);
        if(this.state.currentList!==null){
            this.setState(prevState => ({
                currentList: this.state.listKeyPairMarkedForDeletion.key === this.state.currentList.key ? null : this.state.currentList, //test
                listKeyPairMarkedForDeletion : this.state.listKeyPairMarkedForDeletion,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey, //delete doesnt make new list
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.db.mutationDeleteList(this.state.listKeyPairMarkedForDeletion);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        } else{ //too lazy to do other solutions, basically if the currentlist is null then just do w.e
            this.setState(prevState => ({
                currentList: this.state.currentList, //test
                listKeyPairMarkedForDeletion : this.state.listKeyPairMarkedForDeletion,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey, //delete doesnt make new list
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.db.mutationDeleteList(this.state.listKeyPairMarkedForDeletion);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        }
        this.hideDeleteListModal();
    }
    deleteList = (keyNamePair) => {
        this.setState(prevState => ({
            currentList: this.state.currentList,
            listKeyPairMarkedForDeletion : keyNamePair,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.showDeleteListModal();
    }
    /*
    highlightItem = (index) =>{
        this.setState(prevState => ({
            highlightIndex: index,
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    */
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    currentList={this.state.currentList}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeListCallback={this.closeCurrentList} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                /> 
                <Workspace
                    currentList={this.state.currentList}
                    renameItemCallback={this.renameItem}
                    swapItemCallback={this.swapItem} //pass index from highlightitem to here
                    //highlightItemCallback={this.highlightItem}
                    //highlightIndex={this.state.highlightIndex}
                    /> 
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    keyNamePair={this.state.listKeyPairMarkedForDeletion}
                    confirmedDeleteCallback={this.confirmedDeleteList}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
            </div>
        );
    }
}

export default App;
