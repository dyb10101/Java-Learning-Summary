package cn.edu.jxnu.designpattern.visitor;

public class ConcreteElement2 implements ElementNode {

	@Override
	public void doSomeThings() {
		System.out.println("this is an element2........");

	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

}
