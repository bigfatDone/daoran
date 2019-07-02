/**
 * 菜单数据
 */
export class MenuTreeData {

  //ID
  id:string;

  //父ID
  parentId:string;

  //名称
  name:string;

  //关键字
  keyWord:string;

  //图标
  icon:string;

  //是否展开
  state?:boolean;

  //URL
  url?:string;

  //子节点
  childList?:Array<MenuTreeData>;

}
