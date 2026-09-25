import { Position } from "vscode";

export class NullPosition extends Position
{
    constructor()
    {
        super(0, 0);
    }
}