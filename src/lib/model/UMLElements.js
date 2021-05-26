export default class UMLAttribute {
  name = "";
  type = "";

  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

}


export class UMLMethod {
  name = "";
  type = "";
  params = [];


  constructor(name, type, params) {
    this.name = name;
    this.type = type;
    this.params = params;
  }

}

export const attributeTypes = {
  NUM: "Number",
  BOOL: "Boolean",
  STR: "String"
};
