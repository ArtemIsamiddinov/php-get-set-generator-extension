import { Position } from "vscode";

export interface Positionable {

    getPositionFrom(): Position;
    
    getPositionTo(): Position;
}