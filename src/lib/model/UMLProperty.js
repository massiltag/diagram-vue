export default class UMLProperty {
  name = "";
  type = "";

  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

}

export const attributeTypes = {
  NUM: "Number",
  BOOL: "Boolean",
  STR: "String"
}
