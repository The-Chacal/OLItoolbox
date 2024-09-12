//****************************************//
//   Olivia toolbox
//****************************************//
creatingUI( this );
/**
 * Creates the UI.
 * @param { object } thisObj this.
 */
function creatingUI( thisObj ){
    
    var versionNb = "1.1.2" ;
    var OLItoolboxDlg = thisObj ;
        var OLItoolboxdlgGroup = OLItoolboxDlg.add( "Group" );
            OLItoolboxdlgGroup.orientation = "Column" ;
            OLItoolboxdlgGroup.alignment = [ "center" , "top" ];
            OLItoolboxdlgGroup.spacing = 4 ;
            var userSection = OLItoolboxdlgGroup.add( "Panel" );
                userSection.orientation = "Column" ;
                userSection.margins = [ 4 , 4 , 4 , 10 ];
                userSection.alignment = [ "center" , "top" ];
                userSection.spacing = 4 ;
                var shotNameGroup = userSection.add( "Group" );
                    shotNameGroup.spacing = 0 ;
                    shotNameGroup.add( "StaticText" , undefined , "OL-sq" );
                    var sequenceNb = shotNameGroup.add( "editText{ text: 'XXX' , justify : 'center' , characters : 4 }");
                    shotNameGroup.add( "StaticText" , undefined , "_sh" );
                    var shotNb = shotNameGroup.add( "editText{ text: 'XXX' , justify : 'center' , characters : 4 }");
                var btnsGroupA = userSection.add( "Group");
                    btnsGroupA.spacing = 0 ;
                    btnsGroupA.alignChildren = "Fill" ;
                    var btnsSize = [ 70 , 20 ];
                    var createShot = btnsGroupA.add( "Button" , undefined , "Create" );
                        createShot.helpTip = "   Create your aep file for the selected shot." ;
                        createShot.size = btnsSize ;
                    var openShot = btnsGroupA.add( "Button" , undefined , "Open" );
                        openShot.helpTip = "   Open the selected shot aep file." ;
                        openShot.size = btnsSize ;
                var btnsGroupB = userSection.add( "Group" );
                    btnsGroupB.spacing = 0 ;
                    var exportEXR = btnsGroupB.add( "Button" , undefined , "EXR" );
                        exportEXR.helpTip = "   Set up an export in EXR for the current aep." ;
                        exportEXR.size = btnsSize ;
                    var exportMOV = btnsGroupB.add( "Button" , undefined , "ProRes" );
                        exportMOV.helpTip = "   Set up an export in AppleProRes 422 Proxy for the current aep." ;
                        exportMOV.size = btnsSize ;
                var btnsGroupC = userSection.add( "Group" );
                    btnsGroupC.spacing = 0 ;
                    var updateToolbox = btnsGroupC.add( "Button" , undefined , "Upd." );
                        updateToolbox.helpTip = "   Only works at VL! Studio!\n\n   Update the toolbox jsx file.\n   You'll need to close and reopen the script to apply the update." ;
                        updateToolbox.size = btnsSize ;
            var versionGroup = OLItoolboxdlgGroup.add( "Group" );
                versionGroup.orientation = "Column" ;
                versionGroup.alignment = "Fill" ;
                var versionText = versionGroup.add( "StaticText" , undefined , "OLItoolbox v" + versionNb );
                    versionText.alignment = "Right" ;
            var btnsGroupD = OLItoolboxdlgGroup.add( "Group" );
                btnsGroupD.spacing = 0 ;
                var convertFiles = btnsGroupD.add( "Button" , undefined , "Convert" );
                    convertFiles.size = btnsSize;
                var exportFiles = btnsGroupD.add( "Button" , undefined , "Export" );
                    exportFiles.size = btnsSize;

    
    var savedConvertBtnVisibility = JSON.parse( getSavedString( "OLItoolboxSave" , "convertBtnVisibility" ) );
    if( savedConvertBtnVisibility != null ){
        convertFiles.visible = savedConvertBtnVisibility ;
    } else {
        convertFiles.visible = false ;
        saveString( "OLItoolboxSave" , "convertBtnVisibility" , JSON.stringify( convertFiles.visible ) ); 
    }
    var savedExportBtnVisibility = JSON.parse( getSavedString( "OLItoolboxSave" , "exportBtnVisibility" ) );
    if( savedExportBtnVisibility != null ){
        exportFiles.visible = savedExportBtnVisibility ;
    } else {
        exportFiles.visible = false ;
        saveString( "OLItoolboxSave" , "exportBtnVisibility" , JSON.stringify( exportFiles.visible ) ); 
    }
    
    OLItoolboxDlg.layout.layout( "true" );

    var savedSequenceNb = JSON.parse( getSavedString( "OLItoolboxSave" , "sequenceNb" ) );
    if( savedSequenceNb != null ){ sequenceNb.text = savedSequenceNb ; }
    var savedShotNb = JSON.parse( getSavedString( "OLItoolboxSave" , "shotNb" ) );
    if( savedShotNb != null ){ shotNb.text = savedShotNb ; }

    OLItoolboxDlg.onResizing = function(){ OLItoolboxDlg.layout.resize(); }
    sequenceNb.onActivate = function(){ sequenceNb.text = "" ; }
    shotNb.onActivate = function(){ shotNb.text = "" ; }
    createShot.onClick = function(){ creatingAEP( sequenceNb.text , shotNb.text ); }
    openShot.onClick = function(){ openingAEP( sequenceNb.text , shotNb.text ); }
    exportEXR.onClick = function(){ exportingShot( "EXR" )};
    exportMOV.onClick = function(){ exportingShot( "MOV" )};
    updateToolbox.onClick = updatingToolBox ;
    convertFiles.onClick = convertingTIFFS ;
    exportFiles.onClick = exportTIFFS ;
}
/**
 * Opens a AEP file for the asked shot. 
 * @param { string } sequenceNb Number of the Sequence.
 * @param { string } shotNb Number of the Shot.
 * @returns 
 */
function openingAEP( sequenceNb , shotNb ){
    
    //Cleaning the numbers entered by the user.
    sequenceNb = cleanNumberString( sequenceNb , 3 );
    shotNb = cleanNumberString( shotNb , 3 );
    if( sequenceNb == null || shotNb == null ){ displayAnnounceDlg( "Error" , undefined , "   One or more of the numbers you entered is invalid, please correct it.");  return ; }
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
    var aepFile = new File( new Folder( projectFolder.fsName + "/03_AEP" ).getFiles( "OL-sq" + sequenceNb + "_sh" + shotNb + "_comp_v*.aep" )[0] );
    if( aepFile.exists ){
        //Saving the values for the shot to create.
        saveString( "OLItoolboxSave" ,  "sequenceNb" , JSON.stringify( sequenceNb ) );
        saveString( "OLItoolboxSave" ,  "shotNb" , JSON.stringify( shotNb ) );
        app.open( aepFile );
    } else {
        displayAnnounceDlg( "Error" , undefined , "   I can't find the AEP file for this shot." );
        return ;
    }

}
/**
 * Creates a AEP file for the asked shot. 
 * @param { string } sequenceNb Number of the Sequence.
 * @param { string } shotNb Number of the Shot.
 * @returns 
 */
function creatingAEP( sequenceNb , shotNb ){

    //Cleaning the numbers entered by the user.
    sequenceNb = cleanNumberString( sequenceNb , 3 );
    shotNb = cleanNumberString( shotNb , 3 );
    if( sequenceNb == null || shotNb == null ){ displayAnnounceDlg( "Error" , undefined , "   One or more of the numbers you entered is invalid, please correct it.");  return ; }
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
        var userChoice = displayChoiceDlg( "   The shot \"" +  shotCode + "_comp_v1.0.aep\" already exists.\n\n   Do you really want to overwrite it?" , "Crush it!" , "Let it Live!" , "Open it!" );
        if( userChoice == "B" ){
            app.open( aepFile );
            return ;
        } else if( userChoice == "C" || userChoice == null ){
            return ;
        }
    }
    //Checking the presence of the assets.
    var animationFolder = new File( projectFolder.fsName + "/01_Assets/03_Animation/OL-sq" + sequenceNb + "_sh" + shotNb );
    if( !animationFolder.exists){ displayAnnounceDlg( "Error" , undefined , "   I can't find the animation folder for this shot." ); return ; }
    //Saving the values for the shot to create.
    saveString( "OLItoolboxSave" ,  "sequenceNb" , JSON.stringify( sequenceNb ) );
    saveString( "OLItoolboxSave" ,  "shotNb" , JSON.stringify( shotNb ) );
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
    var animationRefItems = [] ;
    var animationRefFiles = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "*.mp4" );
    if( animationRefFiles.length > 0 ){
        for( var i = 0 ; i < animationRefFiles.length ; i++ ){ 
            var animationRefFile = animationRefFiles[i];
            animationRefItems[i] = app.project.importFile( new ImportOptions( animationRefFile ) );
            animationRefItems[i].parentFolder = assetsFolderItem ;
        }
    }
    //Getting Meta file String.
    var metaFileStrings = [] ;
    var metaFiles = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "*.txt" );
    if( metaFiles.length > 0 ){
        for( i = 0 ; i < metaFiles.length ; i++ ){
            var metaFile = metaFiles[i];
            metaFile.open( "r" );
            metaFileStrings.push( metaFile.read() );
            metaFile.close();
        }
    }
    //Importing Animation Layers in a "Animation" Folder and placing it in the "Assets" Folder.
    var animationItems = [] ;
    var animationFolders = new Folder( animationFolder.fsName ).getFiles( "*" + shotCode + "_*_*" );
    if( animationFolders.length > 0 ){
        for( i = 0 ; i < animationFolders.length ; i++ ){
            if( animationFolders[i] instanceof Folder ){
                var animationFiles = animationFolders[i].getFiles( "*.exr" );
                if( animationFiles.length > 0 ){
                    var animationFile = new File( animationFiles[0].fsName )
                    var importOptions = new ImportOptions();
                    importOptions.file = animationFile ;
                    importOptions.sequence = true ;
                    animationItems.push( app.project.importFile( importOptions ) );
                }
            }
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
    if( animationRefItems.length > 0 && contentCompItem.duration != animationRefItems[0].duration){
        contentCompItem.duration = animationRefItems[0].duration.toFixed( 2 );
    }
    //Adding a text Layer for the meta file
    if( metaFileStrings.length > 0 ){
        for( i = 0 ; i < metaFileStrings.length ; i++ ){
            var textLayer = contentCompItem.layers.addText( metaFileStrings[i] );
            textLayer.name = "Meta File " + ( i + 1);
            textLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ 200 , 375 ] );
            var textProp = textLayer.property(2).property(1);
            var textDocument = textProp.value ;
            /*if( arrayIncludes( app.fonts.allFonts , "Lexend-Medium" ) ){
                textDocument.font = "Lexend-Medium" ;
            } else {
                textDocument.font = "Arial-BoldMT" ;
            }*/
            textDocument.fontSize = 25 ;
            textProp.setValue( textDocument );
            textLayer.label = 0 ;
            textLayer.guideLayer = true ;
            textLayer.moveToEnd();
        }
    }
    //Adding the animatic to the content comp.
    if( animaticItem != null ){
        var animaticLayer = contentCompItem.layers.add( animaticItem );
        animaticLayer.name = "Ref - animaticLayer" ;
        animaticLayer.audioEnabled = false ;
        animaticLayer.guideLayer = true ;
        animaticLayer.label = 0 ;
        animaticLayer.moveToEnd();
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValue( [ 50 , 50 ] );
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Position" ).setValue( [ 200 + animaticLayer.width / 4 , 375 + animaticLayer.height / 4 ] );
        animaticLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 50 );
        animaticLayer.locked = true ;
    }
    //Adding the ref animation to the content comp.
    if( animationRefItems.length > 0 ){
        for( i = 0 ; i < animationRefItems.length ; i++ ){
            var animationRefLayer = contentCompItem.layers.add( animationRefItems[i] );
            if( animationRefItems.length > 1 ){
                animationRefLayer.name = "Ref - Anim" + ( i + 1 );
            } else {
                animationRefLayer.name = "Ref - Anim" ;
            }
            animationRefLayer.audioEnabled = true ;
            animationRefLayer.guideLayer = true ;
            animationRefLayer.label = 0 ;
            animationRefLayer.moveToEnd();
            animationRefLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 50 );
            var ratio = 1 ;
            if( animationRefItems[i].width != 1920 ){ ratio = 1920 / animationRefItems[i].width ; }
            animationRefLayer.property( "ADBE Transform Group" ).property( "ADBE Scale" ).setValue( [ 171.66666666 * ratio , 171.66666666 * ratio ] );
            animationRefLayer.locked = true ;
        }
    }
    //Adding the animation layers to the content comp.
    if( animationItems.length > 0 ){
        for( i = 0 ; i < animationItems.length ; i++ ){
            var animationLayer = contentCompItem.layers.add( animationItems[i] );
            contentCompItem.layers.precompose( [ animationLayer.index ] , animationLayer.name.slice( 0 , -16 ) + " - Footage" , false );
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
    overspillLayer.property( "ADBE Transform Group" ).property( "ADBE Opacity" ).setValue( 75 );
    var overspillLayerMask = overspillLayer.property( "ADBE Mask Parade" ).addProperty( "ADBE Mask Atom" );
    overspillLayerMask.maskMode = MaskMode.SUBTRACT ;
    var overspillLayerMaskPath =  overspillLayerMask.property(1).value ;
    overspillLayerMaskPath.vertices = [ [ 161 , 315 ] , [ 3457 , 315 ] , [ 3457 , 2097 ] , [ 161 , 2097 ] ];
    overspillLayerMask.property(1).setValue( overspillLayerMaskPath );
    overspillLayer.locked = true ;
    //Preparing the Main Composition.
    if( animationRefItems.length > 0 && mainCompItem.duration != animationRefItems[0].duration ){
        mainCompItem.duration = animationRefItems[0].duration.toFixed( 2 );
    } else if( animaticItem != null && mainCompItem.duration != animaticItem.duration ){
        mainCompItem.duration = animaticItem.duration.toFixed( 2 );
    }
    //Disabling the precomp sound.
    if( mainCompItem.layers[1].hasAudio ){
        mainCompItem.layers[1].audioEnabled = false ;
    }
    //Adding a TC.
    var TClayer = mainCompItem.layers.addSolid( [ 0 , 0 , 0 ] , "TC" , mainCompItem.width , mainCompItem.height , mainCompItem.pixelAspect );
    TClayer.adjustmentLayer = true ;
    var TCeffect = TClayer.property( "ADBE Effect Parade" ).addProperty( "ADBE Timecode" );
    TCeffect.property( 1 ).setValue( 2 );
    TCeffect.property( 8 ).setValue( [ 30 , 30 ] );
    TCeffect.property( 9 ).setValue( 40 );

    //Adding the animation Ref for the sound of it.
    if( animationRefItems.length > 0 && animationRefItems[0].hasAudio){
        var soundLayer = mainCompItem.layers.add( animationRefItems[0] );
        soundLayer.name = "Ref - Sound" ;
        soundLayer.audioEnabled = true ;
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
 * @param { array } list The array containing the list to parse.
 * @param { string } item The string to be found in the list. 
 */
function arrayIncludes( list , item ){
    if( list instanceof Array ){
        for( var i = 0 ; i < list.length ; i++ ){
            if( list[i] instanceof Array ){
                if( arrayIncludes( list[i] , item ) ){
                    return true;
                };
            } else {
                if( list[i] == item ){
                    return true ;
                }
            }
        }
    }
    return false ;
}
/**
* Checks if the user entry is a number and return a string with the number of digits wanted. 
* @param { string } entry String given by the User.
* @param { number } digitsNb Number of digits wanted for the final string.
* @returns { string? } String with the number of digits wanted or null.
*/
function cleanNumberString( entry , digitsNb){

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
 * @param { string } saveFileName Name of the txt file in the userData Folder. 
 * @param { string } stringName CodeName for the String to save.
 * @param { string } stringToSave Actual String to save.
 */
function saveString( saveFileName , stringName , stringToSave ){

    var saveFile = new File( Folder.userData.fsName + "/" + saveFileName + ".txt" );
    if( saveFile.exists ){
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close()
        var stringNameIndex = saveFileString.search( stringName );
        if( stringNameIndex >= 0 ){
            var stringEndIndex = saveFileString.search( "</Path" + stringName + ">" );
            var oldString = saveFileString.slice( stringNameIndex , stringEndIndex );
            saveFileString = saveFileString.replace( oldString , stringName + ">" + stringToSave );
        } else {
            saveFileString = saveFileString.concat( "<Path" + stringName + ">" + stringToSave + "</Path" + stringName + ">\r\n" );
        }
        saveFile.open("w");
        saveFile.write( saveFileString );
    } else {
        saveFile.open( "w" );
        saveFile.write("<Path" + stringName + ">" + stringToSave + "</Path" + stringName + ">\r\n");
    }
    saveFile.close();

}
/**
 * Gets a string from a given text file in the user roaming folder. 
 * @param { string } saveFileName Name of the txt file in the userData Folder.
 * @param { string } stringName CodeName for the String to save.
 * @returns { string? } The saved string matching the Codename or null. JSON parsed
 */
function getSavedString( saveFileName , stringName ){

    //Finding the text file
    var saveFile = new File( Folder.userData.fsName + "/" + saveFileName + ".txt" );
    if( saveFile.exists ){
        saveFile.open( "r" );
        var saveFileString = saveFile.read();
        saveFile.close();
        //Getting the String
        var stringNameIndex = saveFileString.search( stringName );
        if( stringNameIndex != -1 ){
            var stringStartIndex = stringNameIndex + stringName.length + 1 ;
            var stringEndIndex = saveFileString.search( "</Path" + stringName + ">" );
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
            mainCompRender.applyTemplate( "SL / CompLength 16bits" );
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
            mainCompRender.applyTemplate( "SL / CompLength 16bits" );
            mainCompRender.outputModules[1].applyTemplate( "SL / AppleProRes 422 Proxy" );
            mainCompRender.outputModules[1].file = new File( MOVfolder.fsName + "/" + itemToExport.name + ".mov");
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
 * @param { string } message - Message to display.
 * @param { string } [ btnAtext = "Yes" ] - Button A text.
 * @param { string } [ btnBtext = "No" ] - Button B text.
 * @param { string } [ btnCtext = "Cancel" ] - Button C text.
 * @returns { string } "A", "B" or "C" - According to the button pressed.
 */
function displayChoiceDlg( message , btnAtext , btnBtext , btnCtext ){

    if( typeof btnAtext === "undefined" ){ btnAtext = "Yes" ; }
    if( typeof btnBtext === "undefined" ){ btnBtext = "No" ; }
    if( typeof btnCtext === "undefined" ){ btnCtext = "Cancel" ; }
    var choiceDialog = new Window( "dialog" , "Decision to take." , undefined , { borderless: true } );
        choiceDialog.global = choiceDialog.add( "group" );
        choiceDialog.global.orientation = "column" ;
        choiceDialog.global.spacing = 2 ;
            choiceDialog.global.panel = choiceDialog.global.add( "panel" );
            choiceDialog.global.panel.message = choiceDialog.global.panel.add( "staticText" , undefined , message , { multiline : true } );
            choiceDialog.global.btnsRow = choiceDialog.global.add( "group" );
            choiceDialog.global.btnsRow.spacing = 0 ;
                var btnA = choiceDialog.global.btnsRow.add( "button" , undefined , btnAtext );
                btnA.size = [ 75 ,25 ];
                var btnB = choiceDialog.global.btnsRow.add( "button" , undefined , btnBtext );
                btnB.size = [ 75 ,25 ];
                var btnC = choiceDialog.global.btnsRow.add( "button" , undefined , btnCtext );
                btnC.size = [ 75 ,25 ];
    var isAgreed = false ;
    choiceDialog.defaultElement = btnA ;
    choiceDialog.cancelElement = btnC ;
    choiceDialog.onResizing = function(){ choiceDialog.layout.resize(); }
    btnA.onClick = function(){ isAgreed = "A" ; choiceDialog.close(); };
    btnB.onClick = function(){ isAgreed = "B" ; choiceDialog.close(); };
    btnC.onClick = function(){ isAgreed = "C" ; choiceDialog.close(); };
    choiceDialog.show();
    return isAgreed ;

}
/**
 * Creates an AEP file with the TIFFS set up for export.
 */
function convertingTIFFS(){

    var shotRegExp = new RegExp( /_[0-9]{2}_[0-9A-Za-z]{2,}_[0-9]{2,}\.TIF/ );
    var takeRegExp = new RegExp( /_[0-9]{2,}\.TIF/ )
    //Locating the initial folder
    var tiffFolder = new Folder( "E:/OLIVIA/01 - DGN/02 - TIFFs" );//E:/OLIVIA/01 - DGN/02 - TIFFs//E:/OLIVIA/00 - Tests/Test - Convert/01 - TIFFs - done
    //Getting the TIFFs
    var tiffCollection = tiffFolder.getFiles( "*.TIF");
    //Getting the existing folders
    var foldersCollection = tiffFolder.getFiles( function( item ){ if( item instanceof Folder && item.name.search( "OL-" ) != -1 ){ return true ;} else { return false ;} } );
    if( tiffCollection.length > 0 ){
        //Getting the unique names of the takes in the folder.
        var takesCollection = []
        for( var i = 0 ; i < tiffCollection.length ; i++ ){
            var takeSaved = false ;
            for( var j = 0 ; j < takesCollection.length ; j++ ){
                if( tiffCollection[i].name.slice( 0 , tiffCollection[i].name.search( takeRegExp ) ) == takesCollection[j].name.slice( 0 , tiffCollection[i].name.search( takeRegExp ) ) ){
                    takeSaved = true ;
                    break ;
                }
            }
            if( !takeSaved ){ takesCollection.push( tiffCollection[i] ) }
        }
        //Checking if the TIFFs have been processed a first time.
        var takesNotToTreat = [] ;
        for( i = 0 ; i < takesCollection.length ; i++ ){
            var choiceA = "A" ;
            for( j = 0 ; j < foldersCollection.length ; j++ ){
                if( takesCollection[i].name.slice( 0 , takesCollection[i].name.search( shotRegExp ) ) == foldersCollection[j].name ){
                    var subfoldersCollection = foldersCollection[j].getFiles( function( item ){ if( item instanceof Folder && item.name.search( "OL-" ) != -1 ){ return true ;} else { return false ;} } );
                    for( var k = 0 ; k < subfoldersCollection.length ; k++ ){
                        if( takesCollection[i].name.slice( 0 , takesCollection[i].name.search( takeRegExp ) ) == subfoldersCollection[k].name ){
                            var filesCollection = subfoldersCollection[k].getFiles("*.TIF");
                            if( filesCollection.length > 0 ){
                                choiceA = displayChoiceDlg( ("   You already converted the take \"" + takesCollection[i].name.slice( 0 , takesCollection[i].name.search( takeRegExp ) ) + "\".\n\n   Are you sure you want to do it again?") )
                            }
                        }
                    }
                }
            }
            if( choiceA == "B" ){
                takesNotToTreat.push( takesCollection[i] );
                takesCollection.splice( i , 1 );
                i-- ;
            } else if( choiceA == "C" ){
                return ;
            }
        }
        if( takesCollection.length > 0 ){
            //Creating a progress bar dialog.
            var conversionProgress = new Window( "palette" , "Work in Progress." );
                conversionProgress.spacing = 2 ;
                var progressGroup = conversionProgress.add( "Group" );
                    progressGroup.spacing = 0 ;
                    var currentStep = progressGroup.add( "StaticText" , undefined , 0 );
                    currentStep.characters = 3 ;
                    progressGroup.add( "StaticText" , undefined , " // " );
                    var totalSteps = progressGroup.add( "StaticText" , undefined , 0 );
                    totalSteps.characters = 3 ;
                var progressBar = conversionProgress.add("progressbar");
                progressBar.size = [ 150 , 15]
            conversionProgress.show()
            //Sorting the TIFF and saving the files for the creation of the AEP.
            for( i = 0 ; i < tiffCollection.length ; i++ ){
                //Updating the Progress Bar ;
                currentStep.text = cleanNumberString( i + 1 , 3 ) ;
                totalSteps.text = cleanNumberString( tiffCollection.length , 3 ) ;
                progressBar.value = ( ( i + 1 ) / tiffCollection.length ) * 100 ;
                conversionProgress.update();
                var toTreat = true ;
                for( j = 0 ; j < takesNotToTreat.length ; j++ ){
                    if( tiffCollection[i].name.slice( 0 , tiffCollection[i].name.search( takeRegExp ) ) == takesNotToTreat[j].name.slice( 0 , takesNotToTreat[j].name.search( takeRegExp ) ) ){
                        toTreat = false ;
                    }
                }
                if( toTreat ){
                    //Creating the folders to sort the TIFFs.
                    var shotFolder = new Folder( tiffFolder.fsName + "/" + tiffCollection[i].name.slice( 0 , tiffCollection[i].name.search( shotRegExp ) ) );
                    if( !shotFolder.exists ){ shotFolder.create(); }
                    var takeFolder = new Folder( shotFolder.fsName + "/" + tiffCollection[i].name.slice( 0 , tiffCollection[i].name.search( takeRegExp ) ) );
                    if( !takeFolder.exists ){ takeFolder.create(); }
                    //Copying the TIFFs in their folder and removing the original.
                    if( tiffCollection[i].copy( new File( takeFolder.fsName + "/" + tiffCollection[i].name ) ) ){ tiffCollection[i].remove(); }
                }
            }
            conversionProgress.close();
            //Updating the path of the takes.
            for( i = 0 ; i < takesCollection.length ; i++ ){
                takesCollection[i] = new File( tiffFolder.fsName + "/" + takesCollection[i].name.slice( 0 , takesCollection[i].name.search( shotRegExp ) ) + "/" + takesCollection[i].name.slice( 0 , takesCollection[i].name.search( takeRegExp ) ) + "/" + takesCollection[i].name )
            }
            
            //Opening the AEP template.
            var templateFile = new File( "E:/OLIVIA/01 - DGN/00 - AEP Template/OLI-TiffConversionTemplate.aep" );
            if( !templateFile.exists ){ displayAnnounceDlg( "Error" , undefined , "   I can't find the Convertion Template so I'll stop working."); return ; }
            //Getting the time stamp in a YYYYMMDD_HH.MM format.
            var timeStamp = new Date() ;
            timeStamp = timeStamp.getFullYear() + cleanNumberString( timeStamp.getMonth() + 1 , 2 ) + cleanNumberString( timeStamp.getDate() , 2 ) + "_" + cleanNumberString( timeStamp.getHours() , 2 ) + "." + cleanNumberString( timeStamp.getMinutes() , 2 );     
            //Creating the template
            var conversionFile = new File( "E:/OLIVIA/01 - DGN/03 - AEPs/conversionFile_" +  timeStamp + ".aep" );
            if( app.project != undefined ){ if( !app.project.close( CloseOptions.PROMPT_TO_SAVE_CHANGES ) ){ return ; } }
            app.open( templateFile );
            app.project.save( conversionFile );
            //Creating the Assets folder for the project.
            var assetsFolder = app.project.items.addFolder("Assets");
            //Parsing the takes.
            var shotsToTreat = [];
            for( i = 0 ; i < takesCollection.length ; i++ ){
                //Importing the take.
                var importOptions = new ImportOptions();
                importOptions.file = takesCollection[i] ;
                importOptions.sequence = true ;
                var takeItem = app.project.importFile( importOptions );
                //Moving it into the Assets Folder.
                takeItem.parentFolder = assetsFolder ;
                //Creating the Composition for the take.
                takesCollection[i] = app.project.items.addComp( takeItem.name.slice( 0 , takeItem.name.search( /_\[[0-9]{4}-[0-9]{4}\]\.TIF/ ) ) , takeItem.width , takeItem.height , 1 , takeItem.duration , 24 );
                //Adding the take to the Composition.
                takesCollection[i].layers.add( takeItem )
                //Preparing the export of the take.
                var shotEXRfolder = new Folder( "E:/OLIVIA/01 - DGN/04 - EXRs/" + takesCollection[i].name.slice( 0 , takesCollection[i].name.search( /_[0-9]{2}_[0-9A-Za-z]{2,}/ ) ) + " - ToDo" );
                if( !shotEXRfolder.exists ){ shotEXRfolder.create(); }
                var takeEXRfolder = new Folder( shotEXRfolder.fsName + "/" + takesCollection[i].name );
                if( !takeEXRfolder.exists ){ takeEXRfolder.create(); }
                //Adding the Comp to the render queue.
                var takeCompRQitem = app.project.renderQueue.items.add( takesCollection[i] );
                takeCompRQitem.applyTemplate( "SL / CompLength 16bits" );
                takeCompRQitem.outputModules[1].applyTemplate( "SL / EXR 16 bits PIZ" );
                takeCompRQitem.outputModules[1].file = new File( takeEXRfolder.fsName + "/" + takesCollection[i].name + "_[####].exr" );
                var shotDGNfolder = new Folder( "E:/OLIVIA/01 - DGN/01 - DGNs" ).getFiles( takesCollection[i].name.slice( 0 , takesCollection[i].name.search( /_[0-9]{2}_[0-9A-Za-z]{2,}/ ) ) + "*.dgn*" );
                if( shotDGNfolder.length > 0 ){ 
                    shotDGNfolder = shotDGNfolder[0];
                    if( shotDGNfolder.name.search( "%20-%20ToExport" ) == -1 ){
                        if( shotDGNfolder.name.search( "%20-%20Done" ) == -1 ){
                            shotDGNfolder.rename( shotDGNfolder.name + " - ToExport" );
                        } else {
                            shotDGNfolder.rename( shotDGNfolder.name.replace( "%20-%20Done" , " - ToExport" ) );
                        }
                        shotsToTreat.push( takesCollection[i].name.slice( 0 , takesCollection[i].name.search( /_[0-9]{2}_[0-9A-Za-z]{2,}/ ) ) )
                    }
                }
                //Opening the Composition so the User can check it before export.
                takesCollection[i].openInViewer();
            }
            //Gathering the animation export and meta file.
            for( i = 0 ; i < shotsToTreat.length ; i ++ ){
                var dgnFolder = new Folder( "E:/OLIVIA/01 - DGN/01 - DGNs" ).getFiles( shotsToTreat[i] + "*.dgn*" );
                if( dgnFolder.length > 0 ){
                    dgnFolder = dgnFolder[0];
                    var shotExports = dgnFolder.getFiles( shotsToTreat[i] + "*.mp4");
                    var shotMetaFiles = dgnFolder.getFiles( shotsToTreat[i] + "*_meta*.txt");
                    if( shotExports.length > 0 ){
                        for( j = 0 ; j < shotExports.length ; j++ ){
                            shotExports[j].copy( new File( "E:/OLIVIA/01 - DGN/04 - EXRs/" + shotsToTreat[i] + " - ToDo/" + shotExports[j].name ) );
                        }
                    }
                    if( shotMetaFiles.length > 0 ){
                        for( j = 0 ; j < shotMetaFiles.length ; j++ ){
                            shotMetaFiles[j].copy( new File( "E:/OLIVIA/01 - DGN/04 - EXRs/" + shotsToTreat[i] + " - ToDo/" + shotMetaFiles[j].name ) );
                        }
                    }
                }
                
            }
            //Making the Render Queue active.
            app.project.renderQueue.showWindow( true )
            //Saving the file
            app.project.save();
        }
    }
    //Announcing the end of the script.
    displayAnnounceDlg( "The End" , "The End :" , "   This is the end, my friend.")

}
//Launch the render queue and update the folders name.
function exportTIFFS(){

    app.project.renderQueue.render();
    var RQitems = app.project.renderQueue.items ;
    for( var i = 1 ; i <= RQitems.length ; i++ ){
        var outputFilePath = RQitems[i].outputModules[1].file.fsName ;
        outputFilePath = outputFilePath.split( "\\" );
        outputFilePath.pop();
        outputFilePath.pop();
        outputFilePath = outputFilePath.join( "\\" );
        var outputShotFolder = new Folder( outputFilePath );
        if( outputShotFolder.exists ){
            if( outputShotFolder.name.search( "%20-%20ToDo" ) != -1 ){
                outputShotFolder.rename( outputShotFolder.name.slice( 0 , - 11 ) );
            }
        }
        var RQitemName = RQitems[i].outputModules[1].file.name ;
        RQitemName = RQitemName.slice( 0 , RQitemName.search( /_[0-9]{2}_[0-9A-Za-z]{2,}/ ) );
        var dgnFolder = new Folder( "E:/OLIVIA/01 - DGN/01 - DGNs" ).getFiles( RQitemName + "*.dgn*" );
        if( dgnFolder.length > 0 ){
            dgnFolder = dgnFolder[0];
            if( dgnFolder.name.search( "%20-%20Done" ) == -1 && dgnFolder.name.search( "%20-%20ToExport" ) == -1 ){
                dgnFolder.rename( dgnFolder.name + " - Done" );
            } else if( dgnFolder.name.search( "%20-%20Done" ) == -1 && dgnFolder.name.search( "%20-%20ToExport" ) != -1 ){
                dgnFolder.rename( dgnFolder.name.replace( "%20-%20ToExport" , "%20-%20Done" ) );
            }
        }
    }
    if( app.project.file.name.search( "%20-%20exported" ) == -1 ){
        var newFileName = app.project.file.name.slice( 0 , -4 ) + " - exported.aep"
        var oldFilePath = app.project.file.fsName ;
        oldFilePath = oldFilePath.split( "\\" );
        oldFilePath.pop();
        oldFilePath = oldFilePath.join( "\\" );
        app.project.file.rename( newFileName );
        app.project.file ;
        app.project.save( new File( oldFilePath + "/" + newFileName ) );
    }
    //Announcing the end of the script.
    displayAnnounceDlg( "The End" , "The End :" , "   This is the end, my friend.")

}
//  json2.js
//  2023-05-10
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10)
            ? "0" + n
            : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (
            value
            && typeof value === "object"
            && typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return (isFinite(value))
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? (
                            "[\n"
                            + gap
                            + partial.join(",\n" + gap)
                            + "\n"
                            + mind
                            + "]"
                        )
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());