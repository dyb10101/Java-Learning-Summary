package cn.edu.jxnu.designpattern.visitor;

import java.util.List;

/**
 * 分别创建访问者和节点元素对象，调用访问者访问变量节点元素
 * 
 * @author 梦境迷离
 *
 */
public class ClientTest {

	public static void main(String[] args) {
		List<ElementNode> list = ObjectStruture.getList();// 所有可以访问的节点元素--------稳定的数据结构，不同的操作
		for (ElementNode elementNode : list) {
			elementNode.accept(new ConcreteVisitor());// 使用访问者
		}
	}

}
