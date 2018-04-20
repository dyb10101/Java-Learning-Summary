package cn.edu.jxnu.designpattern.visitor;

/**
 * 声明访问者所需要的接口
 */
public interface Visitor {
	public void visit(ConcreteElement concreteElement);

	public void visit(ConcreteElement2 concreteElement2);

}
