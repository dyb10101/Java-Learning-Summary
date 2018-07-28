package cn.edu.jxnu.sort;

/**
 * Copyright © 2018 梦境迷离. All rights reserved.
 * 
 * @description:
 * @Package: cn.edu.jxnu.sort
 * @author: 梦境迷离
 * @date: 2018年3月28日 上午9:52:25
 */

public class BubbleSort extends Constant {

	public static void main(String[] args) throws Exception {
		Constant.printResult(new BubbleSort().sort(Constant.array, Constant.len));
	}

	/**
	 * 原始版本冒泡排序
	 */
	@Override
	public Object[] sort(Object[] array, int len) {
		for (int i = 0; i < array.length - 1; i++) {// 外层循环控制排序趟数
			for (int j = 0; j < array.length - 1 - i; j++) {//// 内层循环控制每一趟排序多少次
				if ((int) array[j] > (int) array[j + 1]) {
					Object temp = array[j];
					array[j] = array[j + 1];
					array[j + 1] = temp;
				}
			}
		}
		return array;
	}

}
