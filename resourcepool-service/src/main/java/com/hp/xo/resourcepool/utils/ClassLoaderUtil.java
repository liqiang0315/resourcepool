package com.hp.xo.resourcepool.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class is extremely useful for loading resources and classes in a fault tolerant manner
 * that works across different applications servers.
 * <p/>
 * please don't change things unless you're sure they're not going to break in one server or another!
 * @author Zhefang Chen
 */
public class ClassLoaderUtil {
	private static final Log log = LogFactory.getLog(ClassLoaderUtil.class);
    /**
     * Load a given resource.
     * <p/>
     * This method will try to load the resource using the following methods (in order):
     * <ul>
     * <li>From {@link Thread#getContextClassLoader() Thread.currentThread().getContextClassLoader()}
     * <li>From {@link Class#getClassLoader() ClassLoaderUtil.class.getClassLoader()}
     * <li>From the {@link Class#getClassLoader() callingClass.getClassLoader() }
     * </ul>
     *
     * @param resourceName The name of the resource to load
     * @param callingClass The Class object of the calling object
     */
    public static URL getResource(String resourceName, Class<?> callingClass) {
        URL url = null;

        url = Thread.currentThread().getContextClassLoader().getResource(resourceName);

        if (url == null) {
            url = ClassLoaderUtil.class.getClassLoader().getResource(resourceName);
        }

        if (url == null) {
            url = callingClass.getClassLoader().getResource(resourceName);
        }

        return url;
    }

    /**
     * This is a convenience method to load a resource as a stream.
     * <p/>
     * The algorithm used to find the resource is given in getResource()
     *
     * @param resourceName The name of the resource to load
     * @param callingClass The Class object of the calling object
     */
    public static InputStream getResourceAsStream(String resourceName, Class<?> callingClass) {
        URL url = getResource(resourceName, callingClass);

        try {
            return (url != null) ? url.openStream() : null;
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * Load a class with a given name.
     * <p/>
     * It will try to load the class in the following order:
     * <ul>
     * <li>From {@link Thread#getContextClassLoader() Thread.currentThread().getContextClassLoader()}
     * <li>Using the basic {@link Class#forName(java.lang.String) }
     * <li>From {@link Class#getClassLoader() ClassLoaderUtil.class.getClassLoader()}
     * <li>From the {@link Class#getClassLoader() callingClass.getClassLoader() }
     * </ul>
     *
     * @param className    The name of the class to load
     * @param callingClass The Class object of the calling object
     * @throws ClassNotFoundException If the class cannot be found anywhere.
     */
    public static Class<?> loadClass(String className, Class<?> callingClass) throws ClassNotFoundException {
        try {
            return Thread.currentThread().getContextClassLoader().loadClass(className);
        } catch (ClassNotFoundException e) {
            try {
                return Class.forName(className);
            } catch (ClassNotFoundException ex) {
                try {
                    return ClassLoaderUtil.class.getClassLoader().loadClass(className);
                } catch (ClassNotFoundException exc) {
                    return callingClass.getClassLoader().loadClass(className);
                }
            }
        }
    }

    /**
     * Prints the current classloader hierarchy - useful for debugging.
     */
    public static void printClassLoader() {
        log.info("ClassLoaderUtils.printClassLoader");
        printClassLoader(Thread.currentThread().getContextClassLoader());
    }

    /**
     * Prints the classloader hierarchy from a given classloader - useful for debugging.
     */
    public static void printClassLoader(ClassLoader cl) {
        log.info("ClassLoaderUtils.printClassLoader(cl = " + cl + ")");

        if (cl != null) {
            printClassLoader(cl.getParent());
        }
    }
}