//****************************************//
//   Olivia toolbox v1.0.0 - Released
//****************************************//
creatingUI( this );
/**
 * Creates the UI.
 * @param { object } thisObj this.
 */
function creatingUI( thisObj ){
    
    var OLItoolboxDlg = thisObj ;
        OLItoolboxDlg.alignment = [ "center" , "top" ];
        OLItoolboxDlg.spacing = 4 ;
        var shotNameGroup = OLItoolboxDlg.add( "Group" );
            shotNameGroup.spacing = 0 ;
            shotNameGroup.add( "StaticText" , undefined , "OL-sq" );
            var sequenceNb = shotNameGroup.add( "editText{ text: 'XXX' , justify : 'center' , characters : 4 }");
            shotNameGroup.add( "StaticText" , undefined , "_sh" );
            var shotNb = shotNameGroup.add( "editText{ text: 'XXX' , justify : 'center' , characters : 4 }");
        var btnsGroupA = OLItoolboxDlg.add( "Group");
            btnsGroupA.spacing = 0 ;
            var btnsSize = [ 50 , 25 ];
            var createShot = btnsGroupA.add( "Button" , undefined , "Create" );
                createShot.helpTip = "   Create your aep file for the selected shot."
                createShot.size = btnsSize ;
            var openShot = btnsGroupA.add( "Button" , undefined , "Open" );
                openShot.helpTip = "   Open the selected shot aep file."
                openShot.size = btnsSize ;
        var btnsGroupB = OLItoolboxDlg.add( "Group" );
            btnsGroupB.spacing = 0 ;
            var exportEXR = btnsGroupB.add( "Button" , undefined , "EXR" );
                exportEXR.helpTip = "   Set up an export in EXR for the current aep."
                exportEXR.size = btnsSize ;
            var exportMOV = btnsGroupB.add( "Button" , undefined , "ProRes" );
                exportMOV.helpTip = "   Set up an export in AppleProRes 422 HQ for the current aep."
                exportMOV.size = btnsSize ;
        var btnsGroupC = OLItoolboxDlg.add( "Group" );
            btnsGroupC.spacing = 0 ;
            var updateToolbox = btnsGroupC.add( "Button" , undefined , "Upd." );
                updateToolbox.helpTip = "   Only works at VL! Studio!\n\n   Update the toolbox jsx file.\n   You'll need to close and reopen the script to apply the update."
                updateToolbox.size = btnsSize ;

    OLItoolboxDlg.layout.layout( "true" );

    var savedSequenceNb = getSavedString( "OLItoolboxSave" , "sequenceNb" );
    if( savedSequenceNb != null ){ sequenceNb.text = savedSequenceNb ; }
    var savedShotNb = getSavedString( "OLItoolboxSave" , "shotNb" );
    if( savedShotNb != null ){ shotNb.text = savedShotNb ; }

    OLItoolboxDlg.onResizing = function(){ OLItoolboxDlg.layout.resize(); }
    sequenceNb.onActivate = function(){ sequenceNb.text = "" ; }
    shotNb.onActivate = function(){ shotNb.text = "" ; }
    createShot.onClick = function(){ creatingAEP( sequenceNb.text , shotNb.text ); }
    exportEXR.onClick = function(){ exportingShot( "EXR" )};
    exportMOV.onClick = function(){ exportingShot( "MOV" )};
    updateToolbox.onClick = updatingToolBox ;
}
/**
 * Creates a AEP file for the asked shot. 
 * @param { string } sequenceNb Number of the Sequence.
 * @param { string } shotNb Number of the Shot.
 * @returns 
 */
function creatingAEP( sequenceNb , shotNb ){

    //Cleaning the numbers entered by the user.
    sequenceNb = cleanNumberString( "Sequence" , sequenceNb , 3 );
    shotNb = cleanNumberString( "Shot" , shotNb , 3 );
    if( sequenceNb == null || shotNb == null ){ displayAnnounceDlg( "Error" , undefined , "   One or more of the numbers you entered is invalid, please correct it.");  return ; }
    //
    var shotCode = "OL-sq" + sequenceNb + "_sh" + shotNb ;
    //Getting the Project Folder.
    var projectFolder = getSavedString( "OLItoolboxSave" , "OLIFolder" );
    if( projectFolder == null ){
        projectFolder = Folder.myDocuments.selectDlg( "Where is your \"OLIVIA\" Folder?" );
        if( projectFolder != null && projectFolder.name == "OLIVIA" ){
            saveString( "OLItoolboxSave" ,  "OLIFolder" , projectFolder.fsName );
        } else {
            displayAnnounceDlg( "Error" , undefined , "   You did not select a Folder named \"OLIVIA\".");
            return ;
        }
    } else {
        projectFolder = new Folder( projectFolder );
    }
    //Checking if the aep file already exists.
    var aepFile = new File( projectFolder.fsName + "/03_AEP/OL-sq" + sequenceNb + "_sh" + shotNb + "_comp_v1.0.aep" );
    if( aepFile.exists ){ 
        var userChoice = displayChoiceDlg( shotCode + "_comp_v1.0" );
        if( userChoice == "Cancel" ){
            return ;
        } else if( userChoice == "Open"){
            app.open( aepFile );
            return ;
        }
    }
    //Checking the presence of the assets.
    var animationFolder = new File( projectFolder.fsName + "/01_Assets/03_Animation/OL-sq" + sequenceNb + "_sh" + shotNb );
    if( !animationFolder.exists){ displayAnnounceDlg( "Error" , undefined , "   I can't find the animation folder for this shot." ); return ; }
    //Saving the values for the shot to create.
    saveString( "OLItoolboxSave" ,  "sequenceNb" , sequenceNb );
    saveString( "OLItoolboxSave" ,  "shotNb" , shotNb );
    //Opening the template.
    var templateFolder = new Folder( projectFolder.fsName + "/01_Assets/01_Library/01_AEPlib" );
    var templateFile = new File( templateFolder.getFiles( "OLI_Template_v*" )[0] );
    if( !templateFile.exists ){ displayAnnounceDlg( "Error" , undefined , "   I can't find the OLIVIA Template so I'll stop working."); return ; }
    if( app.project != undefined ){ if( !app.project.close( CloseOptions.PROMPT_TO_SAVE_CHANGES ) ){ return ; } }
    app.open( templateFile );
    app.project.save( aepFile );
    //Locating items needed in the project.
    var mainCompItem = findItem( "OL-shotName" );
    var contentCompItem = findItem( "shotName - Content" );
    var assetsFolderItem = findItem( "Assets" );
    //Renaming Comps
    mainCompItem.name = shotCode + "_comp_v1.0" ;
    contentCompItem.name = shotCode + " - Content" ;

    //------ Importing the Assets------
    //Importing Animatic and placing it in the "Assets" Folder.
    var animaticItem = null ;
    var animaticFiles = new Folder( projectFolder.fsName + "/01_Assets/02_Animatic" ).getFiles( shotCode + "*.mp4" );
    if( animaticFiles.length > 0 ){
        var animaticFile = animaticFiles[0];
        animaticItem = app.project.importFile( new ImportOptions( animaticFile ) );
        animaticItem.parentFolder = assetsFolderItem ;
    }
    //Importing AnimationRef and placing it in the "Assest" Folder.
    var animationRefItem = null ;
    var animationRefFiles = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "*.mp4" );
    if( animationRefFiles.length > 0 ){
        var animationRefFile = animationRefFiles[0];
        animationRefItem = app.project.importFile( new ImportOptions( animationRefFile ) );
        animationRefItem.parentFolder = assetsFolderItem ;
    }
    //Getting Meta file String.
    var metaFileString = null ;
    var metaFiles = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "*.txt" );
    if( metaFiles.length > 0 ){
        var metaFile = metaFiles[0];
        metaFile.open( "r" );
        metaFileString = metaFile.read();
        metaFile.close();
    }
    //Importing Animation Layers in a "Animation" Folder and placing it in the "Assets" Folder.
    var animationItems = [] ;
    var animationFolders = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "_*_*" );
    if( animationFolders.length > 0 ){
        for( i = 0 ; i < animationFolders.length ; i++ ){
            var animationFiles = animationFolders[i].getFiles( "*.exr" );
            if( animationFiles.length > 0 ){
                var animationFile = new File( animationFiles[0].fsName )
                var importOptions = new ImportOptions();
                importOptions.file = animationFile ;
                importOptions.sequence = true ;
            }
            animationItems.push( app.project.importFile( importOptions ) );
        }
        var animationFolderItem = app.project.items.addFolder( "Animation" );
        for( i = 0 ; i < animationItems.length ; i++ ){
            animationItems[i].parentFolder = animationFolderItem ;
        }
        animationFolderItem.parentFolder = assetsFolderItem ;
    }

    //------ Setting up the scene ------
    //Preparing the Content Composition.
    contentCompItem.openInViewer();
    if( animationRefItem != null && contentCompItem.duration != animationRefItem.duration){
        contentCompItem.duration = animationRefItem.duration.toFixed( 2 );
    }
    //Adding the animatic to the content comp.
    if( animaticItem != null ){
        var animaticLayer = contentCompItem.layers.add( animaticItem );
        animaticLayer.name = "Ref - animaticLayer" ;
        animaticLayer.guideLayer = true ;
        animaticLayer.label = 0 ;
        animaticLayer.moveToEnd();
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValue( [ 50 , 50 ] );
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ 150 + animaticLayer.width / 4 , 150 + animaticLayer.height / 4 ] );
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 50 );
        animaticLayer.locked = true ;
    }
    //Adding the ref animation to the content comp.
    if( animationRefItem != null ){
        var animationRefLayer = contentCompItem.layers.add( animationRefItem );
        animationRefLayer.name = "Ref - Anim" ;
        animationRefLayer.audioEnabled = false ;
        animationRefLayer.guideLayer = true ;
        animationRefLayer.label = 0 ;
        animationRefLayer.moveToEnd();
        animationRefLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 50 );
        var ratio = 1 ;
        if( animationRefItem.width != 1920 ){ ratio = 1920 / animationRefItem.width ; }
        animationRefLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValue( [ 171.66666666 * ratio , 171.66666666 * ratio ] );
        animationRefLayer.locked = true ;
    }
    //Adding the animation layers to the content comp.
    if( animationItems.length > 0 ){
        for( i = 0 ; i < animationItems.length ; i++ ){
            var animationLayer = contentCompItem.layers.add( animationItems[i] );
            contentCompItem.layers.precompose( [ animationLayer.index ] , animationLayer.name.slice( 0 , -18 ) + " - Footage" , false );
            animationLayer = contentCompItem.layers[1];
            animationLayer.name = animationLayer.name.slice( 0 , -10 ) ;
            animationLayer.label = 3 ;
            animationLayer.moveToEnd();
        }
    }
    //Adding the overspill layer.
    var overspillLayer = contentCompItem.layers.addSolid( [ 0 , 0 , 0 ] , "Overspill" , contentCompItem.width , contentCompItem.height , contentCompItem.pixelAspect );
    overspillLayer.name = "Overspill" ;
    overspillLayer.guideLayer = true ;
    overspillLayer.label = 0 ;
    overspillLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 50 );
    var overspillLayerMask = overspillLayer.property( "ADBE Mask Parade" ).addProperty( "ADBE Mask Atom" );
    overspillLayerMask.maskMode = MaskMode.SUBTRACT ;
    var overspillLayerMaskPath =  overspillLayerMask.property(1).value ;
    overspillLayerMaskPath.vertices = [ [ 161 , 315 ] , [ 3457 , 315 ] , [ 3457 , 2097 ] , [ 161 , 2097 ] ];
    overspillLayerMask.property(1).setValue( overspillLayerMaskPath );
    overspillLayer.locked = true ;
    //Preparing the Main Composition.
    if( animationRefItem != null && mainCompItem.duration != animationRefItem.duration ){
        mainCompItem.duration = animationRefItem.duration.toFixed( 2 );
    }
    mainCompItem.layers[1].audioEnabled = false ;
    if( animaticItem != null ){
        var soundLayer = mainCompItem.layers.add( animaticItem );
        soundLayer.name = "Ref - Sound" ;
        soundLayer.enabled = false ;
        soundLayer.moveToEnd();
        soundLayer.locked = true ;
    }
    //Saving the work done.
    app.project.save();

}
/**
 * Parses the items of the project to find an item matching the entered name. 
 * @param { string } itemName Name of the Item searched.
 * @returns { object? } the Item Object with matching name or Null.
 */
function findItem( itemName ){

    for( var i = 1 ; i <= app.project.items.length ; i++ ){
        var testedItem = app.project.items[i];
        if( testedItem.name == itemName ){
            return testedItem ;
        }
    }
    return null ;

}
/**
* Checks if the user entry is a number and return a string with the number of digits wanted. 
* @param { string } numberName Name of the Number.
* @param { string } entry String given by the User.
* @param { number } digitsNb number of digits wanted for the final string.
* @returns { string? } string with the number of digits wanted or null.
*/
function cleanNumberString( numberName , entry , digitsNb){

   entry = parseInt( entry , 10 );
   if( isNaN( entry ) ){
       return null ;
   }
   entry = entry.toString();
   while( entry.length < digitsNb )
   {
       entry = "0" + entry ;
   }
   return entry ;

}
/**
 * Saves a String inside a given txt file in the user roaming folder. 
 * @param { string } SaveFileName Name of the txt file in the userData Folder. 
 * @param { string } StringName CodeName for the String to save.
 * @param { string } StringToSave Actual String to save.
 */
function saveString( SaveFileName , StringName , StringToSave ){

    var saveFile = new File( Folder.userData.fsName + "/" + SaveFileName + ".txt" );
    if( saveFile.exists ){
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close()
        var stringNameIndex = saveFileString.search( StringName );
        if( stringNameIndex >= 0 ){
            var stringEndIndex = saveFileString.search( "</Path" + StringName + ">" );
            var oldString = saveFileString.slice( stringNameIndex , stringEndIndex );
            saveFileString = saveFileString.replace( oldString , StringName + ">" + StringToSave );
        } else {
            saveFileString = saveFileString.concat( "<Path" + StringName + ">" + StringToSave + "</Path" + StringName + ">\r\n" );
        }
        saveFile.open("w");
        saveFile.write( saveFileString );
    } else {
        saveFile.open( "w" );
        saveFile.write("<Path" + StringName + ">" + StringToSave + "</Path" + StringName + ">\r\n");
    }
    saveFile.close();

}
/**
 * Gets a string from a given text file in the user roaming folder. 
 * @param { string } SaveFileName Name of the txt file in the userData Folder.
 * @param { string } StringName CodeName for the String to save.
 * @returns { string? } The saved string matching the Codename or null.
 */
function getSavedString( SaveFileName , StringName ){

    //Finding the text file
    var saveFile = new File( Folder.userData.fsName + "/" + SaveFileName + ".txt" );
    if( saveFile.exists ){
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close();
        //Getting the String
        var stringNameIndex = saveFileString.search( StringName );
        if( stringNameIndex != -1 ){
            var stringStartIndex = stringNameIndex + StringName.length + 1 ;
            var stringEndIndex = saveFileString.search( "</Path" + StringName + ">" );
            var string = saveFileString.slice( stringStartIndex , stringEndIndex );
            return string ;
        } else {
            return null ;
        }
    } else {
        return null ;
    }

}
/**
 * Update the script from my Teamshare folder.
 */
function updatingToolBox(){
    var scriptFolder = new Folder( "//peps/studioPEP/TEAM SHARE/Sylvain LORENT/ScriptsAE/OLItoolbox" );
    if( !scriptFolder.exists ){ return ;};
    var scriptFiles = scriptFolder.getFiles( "OLItoolbox*" );
    var targetFolder = new Folder( Folder.userData.fsName + "/Adobe/After Effects/" + app.version.slice( 0 , 4 ) + "/Scripts/ScriptUI Panels" );
    if( !targetFolder.exists ){ targetFolder.create(); }
    for( var i = 0 ; i < scriptFiles.length ; i++ ){
        copyFiles( scriptFiles[i] , targetFolder );
    }
}
/**
 * Copies the File/Folder to the destination.
 * @param { object } item Item to Copy.
 * @param { object } destination Folder to copy into.
 */
function copyFiles( item , destination ){
    if( item instanceof Folder ){
        var newFolder = new Folder( destination.fsName + "/" + item.name )
        newFolder.create()
        var folderFiles = item.getFiles();
        for( var i = 0 ; i < folderFiles.length ; i++ ){
            copyFiles( folderFiles[i] , newFolder );
        }
    } else {
        item.copy( destination.fsName + "\\" + item.name );
    }
}
/**
 * Adds the main Comp to the render queue.
 * @param { string } exportFormat EXR or MOV for EXR sequence or AppleProRes 422 HQ export.
 */
function exportingShot( exportFormat ){
    if( app.project != undefined && app.project.file.name.search( "OL-" ) >= 0 ){
        
        //Getting the Project Folder.
        var projectFolder = getSavedString( "OLItoolboxSave" , "OLIFolder" );
        if( projectFolder == null ){
            projectFolder = Folder.myDocuments.selectDlg( "Where is your \"OLIVIA\" Folder?" );
            if( projectFolder != null && projectFolder.name == "OLIVIA" ){
                saveString( "OLItoolboxSave" ,  "OLIFolder" , projectFolder.fsName );
            } else {
                displayAnnounceDlg( "Error" , undefined , "   You did not select a Folder named \"OLIVIA\".");
                return ;
            }
        } else {
            projectFolder = new Folder( projectFolder );
        }
        //Getting the Comp to Export.
        var exportName = app.project.file.name.replace( "%20" , " " ).slice( 0 , app.project.file.name.length - 4 );
        var itemToExport = findItem( exportName );
        if( itemToExport == null ){
            displayAnnounceDlg( "Error" , undefined , "   You did not name your main comp as your aep file, I can't find it." );
            return ;
        } else if( itemToExport.parentFolder != app.project.rootFolder ){
            displayAnnounceDlg( "Error" , undefined , "   The comp named as the aep file is not in the root Folder of your project.\n\n   It's not as tidy as I like it so I won't do anything.");
            return;
        }
        //Cleaning the renderQueue
        while( app.project.renderQueue.items.length > 0 ){
            app.project.renderQueue.items[1].remove();
        }
        //Adding the Comp to the render queue.
        var mainCompRender = app.project.renderQueue.items.add( itemToExport );
        if( exportFormat == "EXR" ){
            var EXRfolder = new Folder( projectFolder.fsName + "/04_Exports/01_EXR" );
            if( !EXRfolder.exists ){ EXRfolder.create(); }
            mainCompRender.applyTemplate( "SL / CompLength" );
            mainCompRender.outputModules[1].applyTemplate( "SL / EXR 16 bits PIZ" );
            var new_data = {
                "Output File Info":
                {
                    "Base Path": EXRfolder.fsName ,
                    "Subfolder Path": itemToExport.name ,
                    "File Name": itemToExport.name + "_[#####].exr"
                }
            }
            mainCompRender.outputModules[1].setSettings( new_data );
        }
        if( exportFormat == "MOV" ){
            var MOVfolder = new Folder( projectFolder.fsName + "/04_Exports/01_MOV" );
            if( !MOVfolder.exists ){ MOVfolder.create(); }
            mainCompRender.applyTemplate( "SL / CompLength" );
            mainCompRender.outputModules[1].applyTemplate( "SL / AppleProRes 422 HQ" );
            mainCompRender.outputModules[1].file = new File( MOVfolder.fsName + "/" + itemToExport.name );
        }
    }
}
/**
 * Opens a dialog with a message for the user.
 * @param { string } Title Name of the dialog.
 * @param { string } PanelName Name of the Panel.
 * @param { string } Content Message displayed.
 */
function displayAnnounceDlg( Title , PanelName , Content ){
    
    var announceDlg = new Window( "dialog" , Title , undefined , { borderless: true } );
    announceDlg.spacing = 5
        announceDlg.global = announceDlg.add( "Panel" , undefined , PanelName );
            announceDlg.global.msg = announceDlg.global.add( "statictext" , undefined , Content, { multiline: true } );
            announceDlg.global.msg.alignment = "Center" ;
        announceDlg.Btn = announceDlg.add( "Button" , undefined , "Ok" );
        announceDlg.Btn.size = [ 75 , 25 ];
    announceDlg.show();
      
}
/**
 * Opens a dialog giving a choice to the user. 
 * @param { string } shot ShotCode for the Shot. 
 * @returns { string } "Crush", "Cancel" ou "Open" Name of the choice made.
 */
//Return = Boolean
function displayChoiceDlg( shot ){

    var choiceDialog = new Window( "dialog" , "Error" , undefined , { borderless: true } );
        choiceDialog.global = choiceDialog.add( "group" );
        choiceDialog.global.orientation = "column" ;
        choiceDialog.global.spacing = 2 ;
            choiceDialog.global.panel = choiceDialog.global.add( "panel" );
            choiceDialog.global.panel.message = choiceDialog.global.panel.add( "staticText" , undefined , "   The shot \"" + shot + "\" already exists.\n\n   Do you really want to overwrite it?" , { multiline : true } );
            choiceDialog.global.btnsRow = choiceDialog.global.add( "group" );
            choiceDialog.global.btnsRow.spacing = 0 ;
                var btnA = choiceDialog.global.btnsRow.add( "button" , undefined , "Crush it!" );
                btnA.size = [ 75 ,25 ];
                var btnB = choiceDialog.global.btnsRow.add( "button" , undefined , "Let it Live!" );
                btnB.size = [ 75 ,25 ];
                var btnC = choiceDialog.global.btnsRow.add( "button" , undefined , "Open it!" );
                btnC.size = [ 75 ,25 ];
    var isAgreed = false ;
    choiceDialog.defaultElement = btnA ;
    choiceDialog.cancelElement = btnC ;
    choiceDialog.onResizing = function(){ choiceDialog.layout.resize(); }
    btnA.onClick = function(){ isAgreed = "Crush" ; choiceDialog.close(); };
    btnB.onClick = function(){ isAgreed = "Cancel" ; choiceDialog.close(); };
    btnC.onClick = function(){ isAgreed = "Open" ; choiceDialog.close(); };
    choiceDialog.show();
    return isAgreed ;

}