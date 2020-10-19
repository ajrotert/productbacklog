'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');  //User ID
const pid = sessionStorage.getItem('pid');  //Project ID
const readonly = (sessionStorage.getItem('readonly') == null ? false : sessionStorage.getItem('readonly') == 'true' ? true : false);
const canAdd = (sessionStorage.getItem('add') == null ? false : sessionStorage.getItem('add') == 'true' ? true : false);
const canModify = (sessionStorage.getItem('all') == null ? false : sessionStorage.getItem('all') == 'true' ? true : false);
const SHOW_HIDDEN_ITEMS = "Show hidden items";
const STOP_SHOWING_HIDDEN_ITEMS = "Stop showing hidden items";
const SHOW_IN_PROGRESS_ITEMS = "Show in progress items";
const SHOW_ALL_ITEMS = "Show all items";
const SHOW_ENTIRE_BACKLOG = "Show entire backlog";
const SHOW_FIXED_SIZE_BACKLOG = "Show fixed size backlog";
const ADD_YOUR_FIRST_STORY = "Add your first story";
const PRESS_NEW_ITEM_TO_ADD_YOUR_FIRST_STORY = "Press 'New Item' to add your first story";
const USERS_WITH_THIS_CODE_CAN_ONLY_VIEW_THE_PRODUCT_BACKLOG_USERS_CANNOT_ADD_OR_MODIFY_ANY_STORIES_OR_DEFECTS = "Users with this code can only view the product backlog. Users cannot add or modify any stories or defects.";
const USERS_WITH_THIS_CODE_CAN_VIEW_AND_ADD_TO_THE_PRODUCT_BACKLOG_USERS_CANNOT_MODIFY_ANY_EXISTING_STORIES_OR_DEFECTS = "Users with this code can view and add to the product backlog. Users cannot modify any stories or defects.";
const USERS_WITH_THIS_CODE_CAN_VIEW_ADD_AND_MODIFY_THE_PRODUCT_BACKLOG_USERS_CAN_ADD_EDIT_AND_DELETE_ANY_STORY_OR_DEFECT = "Users with this code can view, add, and modify the product backlog. Users can add, edit, and delete any story or defect.";
