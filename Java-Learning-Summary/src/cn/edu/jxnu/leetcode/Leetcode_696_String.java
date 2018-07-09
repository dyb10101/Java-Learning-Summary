package cn.edu.jxnu.leetcode;

/**
 * 
 * 统计二进制字符串中连续 1 和连续 0 数量相同的子字符串个数
 * 
 * 696. Count Binary Substrings (Easy)
 * 
 * Input: "00110011" Output: 6 Explanation: There are 6 substrings that have
 * equal number of consecutive 1's and 0's: "0011", "01", "1100", "10", "0011",
 * and "01"
 * 
 * @author 梦境迷离.
 * @time 2018年7月9日
 * @version v1.0
 */
public class Leetcode_696_String {

	/**
	 * 逻辑：每当我们在‘0’字符或‘1’字符之间切换时，我们都知道这是需要更新总数的时候。
	 * 如果我们有如下顺序.。000011111111000(4个零，9个1，3个零)总数是4+3。
	 * 为什么?因为我们基本上按如下方式对子字符串进行分组。(00001111)111000和00001111(111000)。
	 * 这里请注意，零是限制因素。如果我们有更多的零，我们可以有更多的子串，但既然我们没有，我们就不能再做了。一般来说，我们被较小的序列所包围。
	 * 
	 * @param s
	 * @return
	 *
	 */
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
