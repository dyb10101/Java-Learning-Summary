package cn.edu.jxnu.sort;

/**
 * @author 梦境迷离
 * @description 计数排序
 * 
 *              计数排序 计数排序适用数据范围 计数排序需要占用大量空间，它仅适用于数据比较集中的情况。比如
 *              [0~100]，[10000~19999] 这样的数据。 过程分析 计数排序的基本思想是：
 *              对每一个输入的元素arr[i]，确定小于 arr[i] 的元素个数。 所以可以直接把 arr[i]
 *              放到它输出数组中的位置上。假设有5个数小于 arr[i]，所以 arr[i] 应该放在数组的第6个位置上。 下面给出两种实现：
 *              算法流程（1） 需要三个数组: 待排序数组 int[] arr = new int[]{4,3,6,3,5,1}; 辅助计数数组
 *              int[] help = new int[max - min + 1]; //该数组大小为待排序数组中的最大值减最小值+1
 *              输出数组 int[] res = new int[arr.length]; 1.求出待排序数组的最大值max=6，
 *              最小值min=1 2.实例化辅助计数数组help，help数组中每个下标对应arr中的一个元素，
 *              help用来记录每个元素出现的次数 3.计算 arr 中每个元素在help中的位置 position = arr[i] -
 *              min，此时 help = [1,0,2,1,1,1]; （3出现了两次，2未出现） 4.根据 help
 *              数组求得排序后的数组，此时 res = [1,3,3,4,5,6]
 * 
 *              最佳情况：T(n) = O(n+k) 最差情况：T(n) = O(n+k) 平均情况：T(n) = O(n+k)
 * 
 * @time 2018年4月8日
 */
public class CountSort extends Constant {

	public static void main(String[] args) throws Exception {
		Constant.printResult(new CountSort().sort(Constant.array, Constant.len));

	}

	@Override
	public Object[] sort(Object[] array, int len) {

		return countSort(array);
	}

	public static Object[] countSort(Object[] arr) {

		int max = Integer.MIN_VALUE;
		int min = Integer.MAX_VALUE;
		// 找出数组中的最大最小值
		for (int i = 0; i < arr.length; i++) {
			max = Math.max(max, (int) arr[i]);
			min = Math.min(min, (int) arr[i]);
		}
		// 比max大1
		int help[] = new int[max - min + 1];
		// 找出每个数字出现的次数
		for (int i = 0; i < arr.length; i++) {
			int mapPos = (int) arr[i] - min;
			help[mapPos]++;
		}
		int index = 0;
		for (int i = 0; i < help.length; i++) {
			// 因为可能有重复的数据
			while (help[i]-- > 0) {
				arr[index++] = i + min;
			}
		}
		return arr;
	}

}
