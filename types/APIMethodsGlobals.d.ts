interface DestroyedEntity {
  '@class': IAbstractEntity['@class'];
  id: number;
}

interface IManagedResponse {
  '@class': 'ManagedResponse';
  deletedEntities: DestroyedEntity[];
  updatedEntities: unknown[];
  events: WegasEvent[];
}

/**
 * These methods will work only in editor context
 */
interface APIMethodsClass {
  createVariable: (
    gameModelId: number,
    variableDescriptor: IVariableDescriptor,
    parent?: IParentDescriptor,
    callback?: (res?: SVariableDescriptor) => void,
  ) => void;
  duplicateVariable: (
    variable: IVariableDescriptor,
    callback?: (res?: SVariableDescriptor) => void,
  ) => void;
  moveVariable: (
    variable: IVariableDescriptor,
    parent: IParentDescriptor,
    index: number,
    callback?: (res?: SVariableDescriptor) => void,
  ) => void;
  updateVariable: (instance: IVariableDescriptor) => void;
  deleteVariable: (variable: IVariableDescriptor) => void;
  updateInstance: (variable: IVariableInstance) => void;
  runScript: (
    script: string,
    context: Record<string, unknown>,
  ) => Promise<IManagedResponse>;
  getServerTime: () => Promise<number>;
}
