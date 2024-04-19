const vscode = require('vscode');

async function activate(context) {
   
    async function changeFontFamilyPrompt() {
        
        const fontFamilyPromptResult = await vscode.window.showInformationMessage(
            'Hey there! 👋 Would you like to change your font family to our recommended font family?',
            'Sure, sounds good!', 'No, thanks'
        );

        if (fontFamilyPromptResult === 'Sure, sounds good!') {
            
            vscode.workspace.getConfiguration().update(
                "editor.fontFamily", "Monaco, Consolas, 'Courier New', monospace", vscode.ConfigurationTarget.Global);
            
            vscode.window.showInformationMessage('Font family updated! ✨');
        } else if (fontFamilyPromptResult === 'No, thanks') {
            
            context.globalState.update("fontFamilyPromptDeclined", true);
        }
    }


    async function showReviewPrompt() {
       
        const reviewPromptResult = await vscode.window.showInformationMessage(
            '⭐ Enjoying Ice Theme? Please leave a review to support us. It only takes a moment!',
            'Leave a Review', 'Not Now'
        );

        if (reviewPromptResult === 'Leave a Review') {
            
            vscode.env.openExternal(vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=AyushmaanSingh.blazetheme&ssr=false#review-details'));
            
            context.globalState.update("reviewPromptClicked", true);
        }
    }

    
    const themeSettings = vscode.workspace.getConfiguration().get("workbench.colorTheme");

    
    if (!themeSettings || themeSettings !== "Ice Theme") {
        
        const fontFamilyPromptDeclined = context.globalState.get("fontFamilyPromptDeclined");
        if (!fontFamilyPromptDeclined) {
            changeFontFamilyPrompt();
        }
    }

    
    const lastPromptDate = context.globalState.get("lastReviewPromptDate");
    const reviewPromptClicked = context.globalState.get("reviewPromptClicked");
    const installationDate = context.globalState.get("installationDate");
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

   
    if (installationDate && today.getTime() - installationDate > 7 * 24 * 60 * 60 * 1000) {
        
        if (!reviewPromptClicked && lastPromptDate && new Date(lastPromptDate) < sevenDaysAgo) {
            showReviewPrompt();
           
            context.globalState.update("lastReviewPromptDate", today);
        }
    } else {
       
        if (!installationDate) {
            context.globalState.update("installationDate", today.getTime());
        }
    }
}

exports.activate = activate;
