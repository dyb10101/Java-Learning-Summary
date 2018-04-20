package cn.edu.jxnu.designpattern.visitor;

public class ConcreteElement implements ElementNode {

	@Override
	public void doSomeThings() {
		System.out.println("this is an element1 .....");

	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

}
