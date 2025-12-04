import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {router, useLocalSearchParams} from "expo-router";
import useFetch from "@/services/useFetch";
import {fetchMovieDetails} from "@/services/api";
import {icons} from "@/constants/icons";

interface MovieInfoProps{
    label: string;
    value?: string | number | null;
}

interface GenreInfoProps{
    label: string;
    value?: {id: number, name: string}[] | null;
}

const MovieInfo = ({label, value}: MovieInfoProps)  =>(
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">
            {label}
        </Text>

        <Text className="text-light-100 font-bold text-sm mt-2 ">
            {value || 'N/A'}
        </Text>
    </View>
)

const GenreInfo = ({label, value}: GenreInfoProps)  =>(
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">
            {label}
        </Text>
        <View className="flex-row items-start justify-center gap-x-2">
            {
                value?.map(genre => (
                    <Text className="text-white font-bold text-sm mt-2 bg-[##221F3D] px-2 py-1 rounded-md" key={genre.id}>
                        {genre.name}
                    </Text>
                ))
            }
        </View>
    </View>
)

const MovieDetails  = () => {
    const { id } = useLocalSearchParams();
    const { data:movie, loading } = useFetch(()=>fetchMovieDetails(id as string));
    const monthList: Record<string, string> = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };
    const month = movie?.release_date?.split('-')[1]; // 월만 추출
    const movieMonth = monthList[Number(month)];
    const movieYear = movie?.release_date?.split('-')[0];
    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{paddingBottom:80}}>
                <View>
                    <Image
                        source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
                        className="w-full h-[550px]"
                        resizeMode="stretch"
                    />
                </View>
                <View className="flex-col items-start justify-center mt-5 px-5">
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">{movieYear}</Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
                    </View>
                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4"/>
                        <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10</Text>
                        <Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
                    </View>
                    <MovieInfo label="Overview" value={movie?.overview}/>
                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo label="Release date" value={`${movieMonth} ${movie?.release_date?.split('-')[2]}, ${movieYear}`}/>
                        <MovieInfo label="Status" value={movie?.status}/>
                    </View>
                    <GenreInfo label="Genres" value={movie?.genres} />
                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo label="Budget" value={`$${(movie?.budget ?? 0) / 1_000_000} million`}/>
                        <MovieInfo label="Revenue" value={`$${Math.round ((movie?.revenue ?? 0))/1_000_000}`}/>
                    </View>
                    <MovieInfo label="Tagline" value={movie?.tagline}/>
                    <MovieInfo label="Production Companies" value={movie?.production_companies.map((c)=>c.name).join(' · ') || 'N/A'} />
                </View>
            </ScrollView>
            <TouchableOpacity className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50" onPress={router.back}>
                <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff"/>
                <Text className="text-white font-semibold text-base">Go back</Text>
            </TouchableOpacity>
        </View>
    )
}
export default MovieDetails;
const styles = StyleSheet.create({})
