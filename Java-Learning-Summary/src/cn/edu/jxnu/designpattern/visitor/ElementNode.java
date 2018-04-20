package cn.edu.jxnu.designpattern.visitor;

public interface ElementNode {
	public void doSomeThings();// 做的事情

	public void accept(Visitor visitor);// 接受访问者作为参数传进来

}
