import { Selection } from "vscode";
import { Positionable } from "../interface/positionable";

export const PositionService = {

    /**
     * Выделенная область находится внутри сущности
     * @param entity Сущность для которой проверяем пересечение
     * @param selection Выделенная область
     * @returns Флаг пересечения
     */
    isSelectionInside: function(entity: Positionable, selection: Selection): boolean {
        return entity.getPositionFrom().isBeforeOrEqual(selection.start) 
            && entity.getPositionTo().isAfterOrEqual(selection.end);
    },

    /**
     * Сущность находится внутри выделенной области
     * @param entity Сущность для которой проверяем пересечение
     * @param selection Выделенная область
     * @returns Флаг пересечения
     */
    isEntityInside: function(entity: Positionable, selection: Selection): boolean {
        return selection.start.isBeforeOrEqual(entity.getPositionFrom()) 
            && selection.end.isAfterOrEqual(entity.getPositionTo());
    },

    /**
     * Проверка пересечения каким либо образом сущности с выделенной областью
     * @param entity Сущность для которой проверяем пересечение
     * @param selection Выделенная область
     * @returns Флаг пересечения
     */
    isEntityAnyIntersect: function(entity: Positionable, selection: Selection): boolean {
        if (PositionService.isSelectionInside(entity, selection)) {
            return true;
        }
        if (PositionService.isEntityInside(entity, selection)) {
            return true;
        }
        const isFromIntersect = PositionService.isEntityFromIntersect(entity, selection);
        const isToIntersect = PositionService.isEntityToIntersect(entity, selection);
        return isFromIntersect || isToIntersect;
    },

    /**
     * Проверка пересечения начала сущности с выделенной областью
     * --///|///--|----
     * @param entity Сущность для которой проверяем пересечение
     * @param selection Выделенная область
     * @returns Флаг пересечения
     */
    isEntityFromIntersect: function(entity: Positionable, selection: Selection): boolean {
        const isStartBeforeFrom = selection.start.isBeforeOrEqual(entity.getPositionFrom());
        const isEndAfterFrom = selection.end.isAfterOrEqual(entity.getPositionFrom());
        const isEndBeforeTo = selection.end.isBeforeOrEqual(entity.getPositionTo());
        return isStartBeforeFrom && isEndAfterFrom && isEndBeforeTo;
    },

    /**
     * Проверка пересечения конца сущности с выделенной областью
     * ----|--///|///--
     * @param entity Сущность для которой проверяем пересечение
     * @param selection Выделенная область
     * @returns Флаг пересечения
     */
    isEntityToIntersect: function(entity: Positionable, selection: Selection): boolean {
        const isStartAfterFrom = selection.start.isAfterOrEqual(entity.getPositionFrom());
        const isStartBeforeTo = selection.start.isBeforeOrEqual(entity.getPositionTo());
        const isEndAfterTo = selection.end.isAfterOrEqual(entity.getPositionTo());
        return isStartAfterFrom && isStartBeforeTo && isEndAfterTo;
    },
};
