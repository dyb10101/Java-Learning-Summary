package cn.edu.jxnu.leetcode;

/**
 * 
 * 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数
 * 
 * 696. Count Binary Substrings (Easy)
 * 
 * Input: "00110011" Output: 6 Explanation: There are 6 substrings that have
 * equal number of consecutive 1's and 0's: "0011", "01", "1100", "10", "0011",
 * and
 * 
 * @author 梦境迷离.
 * @time 2018年7月9日
 * @version v1.0
 */
public class Leetcode_696_String {

	public int countBinarySubstrings(String s) {
		int preLen = 0, curLen = 1, count = 0;
		for (int i = 1; i < s.length(); i++) {
			if (s.charAt(i) == s.charAt(i - 1)) {
				curLen++;
			} else {
				preLen = curLen;
				curLen = 1;
			}

			if (preLen >= curLen) {
				count++;
			}
		}
		return count;
	}

}
