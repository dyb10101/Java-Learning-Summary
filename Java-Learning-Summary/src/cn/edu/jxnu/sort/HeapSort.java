package cn.edu.jxnu.sort;

import java.util.Comparator;
import java.util.PriorityQueue;

/**
 * 使用优先级队列实现堆排序 总时间复杂度NlogN = 建堆O(N)+删除一个元素调整logN * N个元素 最多比较次数
 * 2NlogN-O(N)，至少比较次数NlogN-O(N)
 * 
 * @time 2018年3月24日15:58:54
 */
public class HeapSort extends Constant {

	public static void main(String[] args) throws Exception {
		Constant.printResult(new HeapSort().sort(Constant.array, Constant.len));
	}

	/**
	 * 默认是小根堆
	 */
	PriorityQueue<Integer> queue = new PriorityQueue<Integer>(11, new Comparator<Integer>() {
		@Override
		public int compare(Integer o1, Integer o2) {
			return o1.compareTo(o2);
		}
	});

	@Override
	public Object[] sort(Object[] array, int len) {
		for (int i = 0; i < array.length; i++) {
			queue.offer((int) array[i]);
		}
		for (int i = 0; i < array.length; i++) {
			array[i] = queue.poll();
		}
		return array;
	}

}
