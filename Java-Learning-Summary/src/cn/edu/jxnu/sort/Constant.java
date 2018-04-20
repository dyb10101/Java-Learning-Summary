package cn.edu.jxnu.sort;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * 定义排序用的常量,公共方法
 * 
 * 
 * @time 2018年3月24日14:39:51
 */
public abstract class Constant {

	public static final Object[] array = { 8, 34, 64, 51, 33, 22, 44, 55, 88, 1, 0, 2, 2 };
	public static final int len = array.length;

	public static void printResult(Object[] array) throws Exception {
		if (array == null || array.length == 0)
			throw new Exception("no element or invalid element in array");
		// java 8 lambda
		System.out.println(Arrays.stream(array).map(x -> x.toString()).collect(Collectors.joining(",", "[", "]")));
	}

	/**
	 * @author 梦境迷离
	 * @description 子类需要强转。缺点
	 * @time 2018年4月8日
	 */
	public abstract Object[] sort(Object[] array, int len);
}
