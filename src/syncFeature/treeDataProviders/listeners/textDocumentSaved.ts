import { window, type TextDocument } from "vscode";

import { Command } from "@synthexia/bdfd-external";

import { LANG, EMPTY } from "@general/consts";

import { type LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { updateCurrentSyncedCommandState } from "@statusItems/stateUpdaters";

export async function textDocumentSavedListener(document: TextDocument, local: LocalData) {
    if (document.languageId != LANG) return;
    
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);
    const pathSubstrings = document.uri.path.split('/');

    const botId = pathSubstrings[pathSubstrings.length - 2];
    const commandId = pathSubstrings.pop()!.replace(`.${LANG}`, EMPTY);
    const code = document.getText();

    updateCurrentSyncedCommandState(true);
    await Command.update(authToken, botId, commandId, { code }).catch((error) => {
        window.showErrorMessage(`Something went wrong when saving: ${error}`)
    });
    updateCurrentSyncedCommandState(false);

}
