package cn.edu.jxnu.classloder;

import java.net.URL;
import java.net.URLClassLoader;

/**
 * 实现自己的类加载器
 * 
 * @author: 梦境迷离
 * @version 1.0 
 * @time. 2018年4月17日
 */
public class PathClassLoader extends URLClassLoader {
	private String packageName = "cn.edu.jxnu.classloder";

	PathClassLoader(URL[] classPath, ClassLoader parent) {
		super(classPath, parent);
	}

	protected Class<?> findClass(String name) throws ClassNotFoundException {
		Class<?> aClass = findLoadedClass(name);
		if (aClass != null) {
			return aClass;
		}
		if (!packageName.startsWith(name)) {
			return super.loadClass(name);
		} else {
			return findClass(name);
		}
	}
}
